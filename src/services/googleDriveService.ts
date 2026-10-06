import type {
  GoogleDriveFile,
  GoogleDriveSearchOptions,
  GoogleDriveFilterCategory,
  GoogleOAuthToken,
  GoogleUser,
  ArchiveItem,
  Category,
} from '../types';

const STORAGE_KEY_TOKEN = 'dharma_google_oauth_token';
const STORAGE_KEY_USER = 'dharma_google_user';

export const GOOGLE_DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

/**
 * Servicio de Integración de Google Drive (FASE 11)
 *
 * Características principales:
 * - Búsqueda y exploración de archivos en Google Drive.
 * - Almacena ÚNICAMENTE la referencia (URL, metadata, thumbnail) dentro de ARCHIVO.
 * - NO descarga ni sube archivos a Supabase Storage (zero storage overhead).
 * - Apertura directa en Google Drive / Google Docs al interactuar con el recurso.
 */
class GoogleDriveService {
  private token: GoogleOAuthToken | null = null;
  private user: GoogleUser | null = null;

  constructor() {
    this.loadPersistedAuth();
  }

  private loadPersistedAuth() {
    try {
      const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (savedToken) {
        const parsed = JSON.parse(savedToken);
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          this.token = parsed;
        } else if (!parsed.expiresAt) {
          this.token = parsed;
        }
      }
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
    } catch (e) {
      console.warn('Error cargando credenciales de Google para Drive', e);
    }
  }

  isAuthenticated(): boolean {
    if (!this.token) return false;
    if (this.token.expiresAt && Date.now() > this.token.expiresAt) {
      return false;
    }
    return true;
  }

  getCurrentUser(): GoogleUser | null {
    return this.user;
  }

  getToken(): GoogleOAuthToken | null {
    return this.token;
  }

  /**
   * Autenticación OAuth con Google para Google Drive.
   * Utiliza Google Identity Services si hay VITE_GOOGLE_CLIENT_ID configurado,
   * o una sesión Demo de alta fidelidad si se prueba localmente sin llaves.
   */
  async loginWithGoogle(): Promise<{ user: GoogleUser; token: GoogleOAuthToken }> {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // A. Flujo Real GIS
    if (clientId && typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      return new Promise((resolve, reject) => {
        try {
          const client = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: GOOGLE_DRIVE_SCOPES.join(' '),
            callback: async (tokenResponse: any) => {
              if (tokenResponse.error) {
                return reject(new Error(tokenResponse.error_description || tokenResponse.error));
              }

              const tokenData: GoogleOAuthToken = {
                accessToken: tokenResponse.access_token,
                tokenType: tokenResponse.token_type || 'Bearer',
                expiresIn: tokenResponse.expires_in,
                scope: tokenResponse.scope,
                expiresAt: Date.now() + (Number(tokenResponse.expires_in) || 3600) * 1000,
              };

              let userData: GoogleUser = {
                email: 'usuario.drive@gmail.com',
                name: 'Usuario Google Drive',
              };

              try {
                const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenData.accessToken}` },
                });
                if (userRes.ok) {
                  const u = await userRes.json();
                  userData = {
                    email: u.email,
                    name: u.name,
                    picture: u.picture,
                    id: u.sub,
                  };
                }
              } catch (_) {}

              this.saveAuth(tokenData, userData);
              resolve({ user: userData, token: tokenData });
            },
          });

          client.requestAccessToken({ prompt: 'consent' });
        } catch (err) {
          reject(err);
        }
      });
    }

    // B. Sesión Demo Inteligente
    const demoToken: GoogleOAuthToken = {
      accessToken: `demo_drive_token_${Date.now()}`,
      tokenType: 'Bearer',
      expiresIn: 86400,
      expiresAt: Date.now() + 86400 * 1000,
      scope: GOOGLE_DRIVE_SCOPES.join(' '),
    };

    const demoUser: GoogleUser = {
      email: 'usuario.dharma@gmail.com',
      name: 'Usuario Dharma',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    await new Promise((res) => setTimeout(res, 400));
    this.saveAuth(demoToken, demoUser);
    return { user: demoUser, token: demoToken };
  }

  private saveAuth(token: GoogleOAuthToken, user: GoogleUser) {
    this.token = token;
    this.user = user;
    try {
      localStorage.setItem(STORAGE_KEY_TOKEN, JSON.stringify(token));
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } catch (_) {}
  }

  disconnect(): void {
    this.token = null;
    this.user = null;
    try {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch (_) {}
  }

  /**
   * Buscar archivos en Google Drive
   */
  async searchFiles(options: GoogleDriveSearchOptions = {}): Promise<GoogleDriveFile[]> {
    const { query = '', category = 'all', pageSize = 25 } = options;

    // Si hay token real de Google y no es token demo, consultar la API REST de Google Drive
    if (this.token && !this.token.accessToken.startsWith('demo_')) {
      try {
        let qParts = ["trashed = false"];
        if (query.trim()) {
          const sanitized = query.replace(/'/g, "\\'");
          qParts.push(`name contains '${sanitized}'`);
        }

        // Filtro por tipo de archivo
        if (category === 'document') {
          qParts.push("(mimeType = 'application/vnd.google-apps.document' or mimeType contains 'word')");
        } else if (category === 'spreadsheet') {
          qParts.push("(mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType contains 'sheet')");
        } else if (category === 'presentation') {
          qParts.push("(mimeType = 'application/vnd.google-apps.presentation' or mimeType contains 'presentation')");
        } else if (category === 'pdf') {
          qParts.push("mimeType = 'application/pdf'");
        } else if (category === 'folder') {
          qParts.push("mimeType = 'application/vnd.google-apps.folder'");
        } else if (category === 'media') {
          qParts.push("(mimeType contains 'image/' or mimeType contains 'video/' or mimeType contains 'audio/')");
        }

        const qParam = encodeURIComponent(qParts.join(' and '));
        const url = `https://www.googleapis.com/drive/v3/files?q=${qParam}&fields=files(id,name,mimeType,webViewLink,iconLink,thumbnailLink,modifiedTime,size,owners,shared,starred)&pageSize=${pageSize}&orderBy=modifiedTime desc`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${this.token.accessToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.files)) {
            return data.files;
          }
        }
      } catch (err) {
        console.warn('Fallo consultando Google Drive API, usando datos simulados asistidos', err);
      }
    }

    // Modo local / datos representativos contextualizados
    await new Promise((res) => setTimeout(res, 250));
    return this.getMockDriveFiles(query, category);
  }

  /**
   * Catálogo representativo de archivos de Google Drive para demostración local sin llaves
   */
  private getMockDriveFiles(query: string, category: GoogleDriveFilterCategory): GoogleDriveFile[] {
    const allFiles: GoogleDriveFile[] = [
      {
        id: 'gdrive-file-01',
        name: 'Plan Operativo de Biomasa y Sensores 2026.gdoc',
        mimeType: 'application/vnd.google-apps.document',
        webViewLink: 'https://docs.google.com/document/d/1w89qwert-eco-biomasa/edit',
        iconLink: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x16.png',
        thumbnailLink: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
        modifiedTime: '2026-10-05T14:30:00Z',
        size: '124000',
        owners: [{ displayName: 'Eco Ingeniería', emailAddress: 'soporte@eco-ingenieria.org' }],
        starred: true,
      },
      {
        id: 'gdrive-file-02',
        name: 'Presupuesto y Flujo de Caja Solo Guayas Q4.gsheet',
        mimeType: 'application/vnd.google-apps.spreadsheet',
        webViewLink: 'https://docs.google.com/spreadsheets/d/1k92jasd-solo-guayas-q4/edit',
        iconLink: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x16.png',
        thumbnailLink: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
        modifiedTime: '2026-10-04T09:15:00Z',
        size: '482000',
        owners: [{ displayName: 'Finanzas Solo Guayas', emailAddress: 'admin@sologuayas.ec' }],
        shared: true,
      },
      {
        id: 'gdrive-file-03',
        name: 'Estrategia y Métricas Campaña Ocupamor 2026.gslides',
        mimeType: 'application/vnd.google-apps.presentation',
        webViewLink: 'https://docs.google.com/presentation/d/1p84mzx-ocupamor-estrategia/edit',
        iconLink: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_presentation_x16.png',
        thumbnailLink: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
        modifiedTime: '2026-10-03T18:45:00Z',
        size: '12500000',
        owners: [{ displayName: 'Anderling Ocupamor', emailAddress: 'anderling@ocupamor.com' }],
      },
      {
        id: 'gdrive-file-04',
        name: 'Arquitectura de Microservicios y Cloud — Team Nox.pdf',
        mimeType: 'application/pdf',
        webViewLink: 'https://drive.google.com/file/d/1r44qwe-team-nox-arch/view',
        iconLink: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_pdf_x16.png',
        thumbnailLink: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
        modifiedTime: '2026-10-02T11:20:00Z',
        size: '3450000',
        owners: [{ displayName: 'Team Nox Lead', emailAddress: 'tech@nox-systems.io' }],
        starred: true,
      },
      {
        id: 'gdrive-file-05',
        name: 'Registro Histórico de Caudal y Precipitaciones.csv',
        mimeType: 'text/csv',
        webViewLink: 'https://drive.google.com/file/d/1z91csv-caudal-sensores/view',
        iconLink: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x16.png',
        thumbnailLink: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=600&auto=format&fit=crop&q=80',
        modifiedTime: '2026-09-29T16:00:00Z',
        size: '890000',
        owners: [{ displayName: 'Eco Ingeniería', emailAddress: 'soporte@eco-ingenieria.org' }],
      },
      {
        id: 'gdrive-file-06',
        name: 'Manual de Identidad Visual y Filosofía DHARMA.pdf',
        mimeType: 'application/pdf',
        webViewLink: 'https://drive.google.com/file/d/1dhr-brand-identity-v1/view',
        iconLink: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_pdf_x16.png',
        thumbnailLink: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
        modifiedTime: '2026-09-25T10:10:00Z',
        size: '18500000',
        owners: [{ displayName: 'Usuario Dharma', emailAddress: 'usuario.dharma@gmail.com' }],
        starred: true,
      },
      {
        id: 'gdrive-file-07',
        name: 'Investigación Modelos IA Multimodales en Edge.gdoc',
        mimeType: 'application/vnd.google-apps.document',
        webViewLink: 'https://docs.google.com/document/d/1llm-team-nox-research/edit',
        iconLink: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x16.png',
        thumbnailLink: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        modifiedTime: '2026-09-21T08:30:00Z',
        size: '310000',
        owners: [{ displayName: 'Team Nox', emailAddress: 'tech@nox-systems.io' }],
      },
      {
        id: 'gdrive-file-08',
        name: 'Carpeta: Contratos y Guías de Remisión 2026',
        mimeType: 'application/vnd.google-apps.folder',
        webViewLink: 'https://drive.google.com/drive/folders/1folder-solo-guayas-remesas',
        iconLink: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_folder_x16.png',
        thumbnailLink: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
        modifiedTime: '2026-09-18T15:20:00Z',
        owners: [{ displayName: 'Logística Solo Guayas', emailAddress: 'admin@sologuayas.ec' }],
      },
      {
        id: 'gdrive-file-09',
        name: 'Fotografías de Producto y Campaña Anderling.zip',
        mimeType: 'application/zip',
        webViewLink: 'https://drive.google.com/file/d/1zip-fotos-ocupamor/view',
        iconLink: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_archive_x16.png',
        thumbnailLink: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
        modifiedTime: '2026-09-15T12:00:00Z',
        size: '142000000',
        owners: [{ displayName: 'Anderling Ocupamor', emailAddress: 'anderling@ocupamor.com' }],
      },
      {
        id: 'gdrive-file-10',
        name: 'Grabación de Sesión de Arquitectura de Sistemas.mp4',
        mimeType: 'video/mp4',
        webViewLink: 'https://drive.google.com/file/d/1video-arq-team-nox/view',
        iconLink: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_video_x16.png',
        thumbnailLink: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
        modifiedTime: '2026-09-10T17:45:00Z',
        size: '348000000',
        owners: [{ displayName: 'Team Nox Lead', emailAddress: 'tech@nox-systems.io' }],
      },
    ];

    // Aplicar filtros
    return allFiles.filter((file) => {
      // Filtro de texto
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchesName = file.name.toLowerCase().includes(q);
        const matchesOwner = file.owners?.some((o) =>
          o.displayName?.toLowerCase().includes(q) || o.emailAddress?.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesOwner) return false;
      }

      // Filtro de categoría MIME
      if (category !== 'all') {
        const info = this.getFileTypeInfo(file.mimeType);
        if (info.category !== category) return false;
      }

      return true;
    });
  }

  /**
   * Información visual y semántica sobre el tipo MIME del archivo
   */
  getFileTypeInfo(mimeType: string): {
    label: string;
    tag: string;
    color: string;
    bgSoft: string;
    category: GoogleDriveFilterCategory;
  } {
    if (mimeType.includes('document') || mimeType.includes('word')) {
      return {
        label: 'Google Docs',
        tag: 'Google Docs',
        color: '#1A73E8',
        bgSoft: '#E8F0FE',
        category: 'document',
      };
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('sheet') || mimeType.includes('csv')) {
      return {
        label: 'Google Sheets',
        tag: 'Google Sheets',
        color: '#188038',
        bgSoft: '#E6F4EA',
        category: 'spreadsheet',
      };
    }
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
      return {
        label: 'Google Slides',
        tag: 'Google Slides',
        color: '#E37400',
        bgSoft: '#FEF7E0',
        category: 'presentation',
      };
    }
    if (mimeType === 'application/pdf') {
      return {
        label: 'PDF',
        tag: 'Documento PDF',
        color: '#D93025',
        bgSoft: '#FCE8E6',
        category: 'pdf',
      };
    }
    if (mimeType.includes('folder')) {
      return {
        label: 'Carpeta',
        tag: 'Carpeta Drive',
        color: '#5F6368',
        bgSoft: '#F1F3F4',
        category: 'folder',
      };
    }
    if (mimeType.includes('image') || mimeType.includes('video') || mimeType.includes('audio')) {
      return {
        label: 'Multimedia',
        tag: 'Multimedia Drive',
        color: '#9334E6',
        bgSoft: '#F3E8FD',
        category: 'media',
      };
    }

    return {
      label: 'Archivo Drive',
      tag: 'Google Drive',
      color: '#4285F4',
      bgSoft: '#E8F0FE',
      category: 'all',
    };
  }

  /**
   * Sugiere automáticamente la categoría DHARMA adecuada según el nombre o metadatos del archivo
   */
  suggestCategoryForFile(filename: string, categories: Category[]): string {
    const lower = filename.toLowerCase();

    if (lower.includes('eco') || lower.includes('ingenieria') || lower.includes('biomasa') || lower.includes('caudal')) {
      const match = categories.find((c) => c.name.toLowerCase().includes('eco'));
      if (match) return match.id;
    }

    if (lower.includes('guayas') || lower.includes('solo guayas') || lower.includes('remesas') || lower.includes('bodega')) {
      const match = categories.find((c) => c.name.toLowerCase().includes('guayas'));
      if (match) return match.id;
    }

    if (lower.includes('nox') || lower.includes('cloud') || lower.includes('infra') || lower.includes('sistemas') || lower.includes('llm')) {
      const match = categories.find((c) => c.name.toLowerCase().includes('nox'));
      if (match) return match.id;
    }

    if (lower.includes('ocupamor') || lower.includes('anderling')) {
      const match = categories.find((c) => c.name.toLowerCase().includes('ocupamor'));
      if (match) return match.id;
    }

    if (lower.includes('personal') || lower.includes('dharma') || lower.includes('marca')) {
      const match = categories.find((c) => c.name.toLowerCase().includes('personal'));
      if (match) return match.id;
    }

    // Retorna la primera categoría disponible o una por defecto
    return categories[0]?.id || 'cat-personal';
  }

  /**
   * Formatear bytes a tamaño legible
   */
  formatFileSize(bytes?: string | number): string {
    if (!bytes) return '';
    const num = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
    if (isNaN(num) || num <= 0) return '';
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    if (num < 1024 * 1024 * 1024) return `${(num / (1024 * 1024)).toFixed(1)} MB`;
    return `${(num / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }

  /**
   * Prepara los datos del recurso para guardarlo en ARCHIVO.
   *
   * IMPORTANTE — REQUISITO CRÍTICO DE FASE 11:
   * - NO copia archivos de Drive a Supabase.
   * - Guarda ÚNICAMENTE la referencia necesaria (URL, metadata, thumbnail, id del archivo).
   * - Al abrir, se abre el archivo en Google Drive en nueva pestaña.
   */
  prepareArchiveItemFromDrive(
    file: GoogleDriveFile,
    categoryId: string,
    tags: string[] = [],
    customTitle?: string,
    customDescription?: string
  ): Omit<ArchiveItem, 'id' | 'createdAt'> {
    const typeInfo = this.getFileTypeInfo(file.mimeType);
    
    // Dominio limpio
    let domain = 'drive.google.com';
    if (file.mimeType.includes('document')) domain = 'docs.google.com';
    else if (file.mimeType.includes('spreadsheet')) domain = 'sheets.google.com';
    else if (file.mimeType.includes('presentation')) domain = 'slides.google.com';

    // Generar tags automáticos sin duplicados
    const combinedTags = Array.from(
      new Set([typeInfo.tag, 'Google Drive', ...tags.filter(Boolean)])
    );

    const description =
      customDescription ||
      `Archivo de Google Drive (${typeInfo.label}) vinculado directamente a DHARMA sin descargas ni almacenamiento redundante.`;

    return {
      title: customTitle || file.name.replace(/\.(gdoc|gsheet|gslides)$/, ''),
      url: file.webViewLink,
      domain,
      description,
      imageUrl: file.thumbnailLink,
      categoryId,
      tags: combinedTags,
      isFavorite: file.starred || false,
      source: 'google_drive',
      driveFileId: file.id,
      driveMimeType: file.mimeType,
      driveIconLink: file.iconLink,
    };
  }
}

export const googleDriveService = new GoogleDriveService();
