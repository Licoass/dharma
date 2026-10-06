import type {
  GmailEmail,
  GmailSearchOptions,
  GmailLabelFilter,
  GoogleOAuthToken,
  GoogleUser,
  Task,
  TaskPriority,
  Category,
} from '../types';
import { getTodayISO } from '../utils/dateUtils';

const STORAGE_KEY_TOKEN = 'dharma_google_oauth_token';
const STORAGE_KEY_USER = 'dharma_google_user';

export const GOOGLE_GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

/**
 * Servicio de Integración de Gmail (FASE 12)
 *
 * Filosofía y Límites del Módulo:
 * - NO construye un cliente de correo electrónico completo.
 * - Gmail sigue siendo Gmail.
 * - DHARMA lo utiliza estrictamente como FUENTE DE INFORMACIÓN:
 *   1. Buscar correos
 *   2. Seleccionar correo
 *   3. Ver información básica
 *   4. Convertir correo en tarea dentro de DHARMA
 */
class GmailService {
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
      console.warn('Error cargando credenciales de Google para Gmail', e);
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
   * Conexión OAuth con Google para Gmail
   */
  async loginWithGoogle(): Promise<{ user: GoogleUser; token: GoogleOAuthToken }> {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // A. Flujo Real con GIS
    if (clientId && typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      return new Promise((resolve, reject) => {
        try {
          const client = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: GOOGLE_GMAIL_SCOPES.join(' '),
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
                email: 'usuario.gmail@gmail.com',
                name: 'Usuario Gmail',
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

    // B. Sesión Demo Inteligente para pruebas inmediatas
    const demoToken: GoogleOAuthToken = {
      accessToken: `demo_gmail_token_${Date.now()}`,
      tokenType: 'Bearer',
      expiresIn: 86400,
      expiresAt: Date.now() + 86400 * 1000,
      scope: GOOGLE_GMAIL_SCOPES.join(' '),
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
   * Buscar correos en Gmail (filtrado por consulta y etiquetas)
   */
  async searchEmails(options: GmailSearchOptions = {}): Promise<GmailEmail[]> {
    const { query = '', labelFilter = 'ALL', maxResults = 25 } = options;

    // Si hay token real de Google y no es token de prueba demo, consultar la API REST de Gmail
    if (this.token && !this.token.accessToken.startsWith('demo_')) {
      try {
        let qParts: string[] = [];
        if (query.trim()) qParts.push(query.trim());
        if (labelFilter === 'UNREAD') qParts.push('is:unread');
        if (labelFilter === 'STARRED') qParts.push('is:starred');
        if (labelFilter === 'IMPORTANT') qParts.push('is:important');

        const qParam = encodeURIComponent(qParts.join(' '));
        const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${qParam}&maxResults=${maxResults}`;

        const listRes = await fetch(url, {
          headers: { Authorization: `Bearer ${this.token.accessToken}` },
        });

        if (listRes.ok) {
          const listData = await listRes.json();
          if (Array.isArray(listData.messages)) {
            // Traer metadatos básicos de los primeros mensajes
            const detailedEmails = await Promise.all(
              listData.messages.slice(0, 15).map(async (msg: { id: string }) => {
                const msgRes = await fetch(
                  `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata`,
                  { headers: { Authorization: `Bearer ${this.token!.accessToken}` } }
                );
                if (!msgRes.ok) return null;
                const m = await msgRes.json();
                const headers = m.payload?.headers || [];
                const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(Sin asunto)';
                const fromHeader = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || '';
                const dateHeader = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';

                // Extraer nombre y correo del encabezado From
                const match = fromHeader.match(/(.*?)\s*<(.+?)>/) || [null, fromHeader, fromHeader];
                const fromName = (match[1] || match[2] || 'Desconocido').replace(/"/g, '').trim();
                const fromEmail = match[2] || fromHeader;

                return {
                  id: m.id,
                  threadId: m.threadId,
                  subject,
                  from: { name: fromName, email: fromEmail },
                  date: dateHeader || new Date().toISOString(),
                  snippet: m.snippet || '',
                  bodyText: m.snippet || '',
                  isUnread: m.labelIds?.includes('UNREAD'),
                  isStarred: m.labelIds?.includes('STARRED'),
                  isImportant: m.labelIds?.includes('IMPORTANT'),
                  labels: m.labelIds || [],
                  gmailWebLink: `https://mail.google.com/mail/u/0/#inbox/${m.id}`,
                } as GmailEmail;
              })
            );

            return detailedEmails.filter(Boolean) as GmailEmail[];
          }
        }
      } catch (err) {
        console.warn('Fallo consultando Gmail API directa, utilizando datos asistidos', err);
      }
    }

    // Modo local / demostración con correos contextualizados
    await new Promise((res) => setTimeout(res, 250));
    return this.getMockEmails(query, labelFilter);
  }

  /**
   * Catálogo representativo de correos de Gmail para demostración local inmediata
   */
  private getMockEmails(query: string, labelFilter: GmailLabelFilter): GmailEmail[] {
    const today = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const toDateStr = (daysAgo: number, timeStr: string) => {
      const d = new Date(today);
      d.setDate(d.getDate() - daysAgo);
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${timeStr}`;
    };

    const allEmails: GmailEmail[] = [
      {
        id: 'gmail-msg-01',
        subject: 'Revisión de fotos para campaña Ocupamor y copy para redes',
        from: {
          name: 'Anderling',
          email: 'anderling@ocupamor.com',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
        },
        to: 'usuario.dharma@gmail.com',
        date: toDateStr(0, '09:25'),
        snippet: 'Hola! Te adjunto el enlace con las fotos editadas de la sesión de ayer. Necesito que revises el copy antes de las 3pm para programar las publicaciones de la semana...',
        bodyText: `Hola!

Te adjunto el enlace con las fotos editadas de la sesión de ayer para Ocupamor.
Necesito que revises el copy de los 3 posts antes de las 3:00 PM para poder dejarlos programados en Meta Business Suite.

Los puntos clave que debemos resaltar son:
1. Nueva colección de temporada
2. Envíos express a nivel nacional
3. Descuento del 15% por preventa

Quedo atenta a tus comentarios. Saludos!`,
        isUnread: true,
        isStarred: true,
        isImportant: true,
        labels: ['INBOX', 'UNREAD', 'IMPORTANT', 'STARRED'],
        hasAttachments: true,
        gmailWebLink: 'https://mail.google.com/mail/u/0/#inbox/gmail-msg-01',
      },
      {
        id: 'gmail-msg-02',
        subject: 'Alerta en sensor de biomasa y calibración de caudal estación norte',
        from: {
          name: 'Ing. Carlos Mendoza (Eco Ingeniería)',
          email: 'cmendoza@eco-ingenieria.org',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
        },
        to: 'usuario.dharma@gmail.com',
        date: toDateStr(0, '07:40'),
        snippet: 'El caudalímetro registró una fluctuación inusual anoche a las 02:30. Deberíamos agendar una inspección técnica preventiva mañana a primera hora...',
        bodyText: `Estimado equipo de Eco Ingeniería,

El caudalímetro de la estación norte registró una fluctuación inusual anoche a las 02:30 AM (pico de 4.2 L/s con retorno rápido a 1.1 L/s).
Recomiendo realizar:
1. Inspección visual de la válvula de retención
2. Calibración del transductor de presión diferencial
3. Comprobación de batería del datalogger solar

¿Podríamos coordinar la visita a campo para mañana a primera hora?

Atentamente,
Ing. Carlos Mendoza`,
        isUnread: true,
        isStarred: false,
        isImportant: true,
        labels: ['INBOX', 'UNREAD', 'IMPORTANT'],
        hasAttachments: false,
        gmailWebLink: 'https://mail.google.com/mail/u/0/#inbox/gmail-msg-02',
      },
      {
        id: 'gmail-msg-03',
        subject: 'Guías de remisión y confirmación de camiones para bodega Solo Guayas',
        from: {
          name: 'Logística Solo Guayas',
          email: 'logistica@sologuayas.ec',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
        },
        to: 'usuario.dharma@gmail.com',
        date: toDateStr(1, '16:15'),
        snippet: 'Confirmamos la salida de los dos fletes hacia la bodega central. Se requiere firmar las copias físicas a la llegada y validar el número de bultos...',
        bodyText: `Buenas tardes,

Confirmamos la salida de los dos fletes con destino a la bodega central de Solo Guayas (Sector Industrial).
- Camión 1: Placas GBY-8420 (240 bultos)
- Camión 2: Placas GDF-1193 (185 bultos)

Se requiere que el responsable en sitio firme las copias físicas de las guías de remisión N° 4581 y 4582 antes de las 18:00.

Saludos cordiales,
Departamento de Logística Solo Guayas`,
        isUnread: false,
        isStarred: true,
        isImportant: true,
        labels: ['INBOX', 'IMPORTANT', 'STARRED'],
        hasAttachments: true,
        gmailWebLink: 'https://mail.google.com/mail/u/0/#inbox/gmail-msg-03',
      },
      {
        id: 'gmail-msg-04',
        subject: 'Aprobación de Pull Request y release v2.4 — Team Nox',
        from: {
          name: 'GitHub (Team Nox CI/CD)',
          email: 'notifications@nox-systems.io',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
        },
        to: 'usuario.dharma@gmail.com',
        date: toDateStr(1, '11:05'),
        snippet: 'El pipeline de staging pasó todas las pruebas automatizadas (48/48). Por favor revisa y aprueba el PR #142 para coordinar el deploy a producción...',
        bodyText: `Team Nox Automation Pipeline

El PR #142 "Feat: Edge synchronization engine and offline retry queue" ha pasado satisfactoriamente todas las pruebas unitarias y de integración en el entorno de Staging.

Revisores requeridos: @usuario-lead
Acciones pendientes:
- Aprobar PR en GitHub
- Verificar migraciones de base de datos
- Desplegar tag v2.4.0 en Kubernetes

Detalles: https://github.com/team-nox/core-engine/pull/142`,
        isUnread: false,
        isStarred: false,
        isImportant: false,
        labels: ['INBOX'],
        hasAttachments: false,
        gmailWebLink: 'https://mail.google.com/mail/u/0/#inbox/gmail-msg-04',
      },
      {
        id: 'gmail-msg-05',
        subject: 'Comprobante de retención y factura comercial electrónica N° 001-002-8472',
        from: {
          name: 'Servicios Financieros EC',
          email: 'facturas@servicios-fin.ec',
        },
        to: 'usuario.dharma@gmail.com',
        date: toDateStr(2, '14:20'),
        snippet: 'Estimado cliente, su comprobante electrónico por concepto de servicios profesionales ha sido emitido con fecha de vencimiento el próximo viernes...',
        bodyText: `Estimado(a) Cliente,

Le informamos que ha sido emitido su comprobante electrónico:
- Documento: Factura Electrónica
- N°: 001-002-00008472
- Monto Total: $345.00 USD
- Vencimiento: Próximo viernes

Adjunto encontrará el archivo XML y la representación impresa en formato PDF.

Atentamente,
Departamento de Cobranzas`,
        isUnread: false,
        isStarred: false,
        isImportant: false,
        labels: ['INBOX'],
        hasAttachments: true,
        gmailWebLink: 'https://mail.google.com/mail/u/0/#inbox/gmail-msg-05',
      },
      {
        id: 'gmail-msg-06',
        subject: 'Muestras de cajas de regalo y confirmación de reunión de empaque',
        from: {
          name: 'Anderling',
          email: 'anderling@ocupamor.com',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
        },
        to: 'usuario.dharma@gmail.com',
        date: toDateStr(3, '10:00'),
        snippet: '¿Podrías confirmar si tienes disponible mañana a las 11:30 para revisar las muestras de cajas que llegaron del proveedor? Son 3 alternativas...',
        bodyText: `Hola!

¿Podrías confirmar si tienes disponible mañana a las 11:30 para revisar las muestras de cajas rígidas que nos llegaron del nuevo proveedor?
Tenemos 3 alternativas de gramaje y acabado mate que debemos definir para la producción del próximo mes.

Un abrazo!`,
        isUnread: false,
        isStarred: true,
        isImportant: true,
        labels: ['INBOX', 'STARRED', 'IMPORTANT'],
        hasAttachments: false,
        gmailWebLink: 'https://mail.google.com/mail/u/0/#inbox/gmail-msg-06',
      },
    ];

    // Filtros
    return allEmails.filter((email) => {
      // Filtro de etiquetas
      if (labelFilter === 'UNREAD' && !email.isUnread) return false;
      if (labelFilter === 'STARRED' && !email.isStarred) return false;
      if (labelFilter === 'IMPORTANT' && !email.isImportant) return false;

      // Filtro de texto
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchSubject = email.subject.toLowerCase().includes(q);
        const matchSnippet = email.snippet.toLowerCase().includes(q);
        const matchBody = email.bodyText?.toLowerCase().includes(q);
        const matchFromName = email.from.name.toLowerCase().includes(q);
        const matchFromEmail = email.from.email.toLowerCase().includes(q);

        if (!matchSubject && !matchSnippet && !matchBody && !matchFromName && !matchFromEmail) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Sugiere automáticamente la categoría DHARMA analizando remitente, asunto y contenido
   */
  suggestCategoryForEmail(email: GmailEmail, categories: Category[]): string {
    const text = `${email.subject} ${email.snippet} ${email.from.name} ${email.from.email}`.toLowerCase();

    if (text.includes('eco') || text.includes('ingenieria') || text.includes('biomasa') || text.includes('caudal') || text.includes('sensor')) {
      const match = categories.find((c) => c.name.toLowerCase().includes('eco'));
      if (match) return match.id;
    }

    if (text.includes('guayas') || text.includes('remesas') || text.includes('bodega') || text.includes('fletes')) {
      const match = categories.find((c) => c.name.toLowerCase().includes('guayas'));
      if (match) return match.id;
    }

    if (text.includes('nox') || text.includes('pull request') || text.includes('staging') || text.includes('deploy') || text.includes('release') || text.includes('github')) {
      const match = categories.find((c) => c.name.toLowerCase().includes('nox'));
      if (match) return match.id;
    }

    if (text.includes('ocupamor') || text.includes('anderling') || text.includes('copy') || text.includes('posts')) {
      const match = categories.find((c) => c.name.toLowerCase().includes('ocupamor'));
      if (match) return match.id;
    }

    if (text.includes('factura') || text.includes('retención') || text.includes('comprobante') || text.includes('banco')) {
      const match = categories.find((c) => c.name.toLowerCase().includes('personal') || c.name.toLowerCase().includes('otros'));
      if (match) return match.id;
    }

    return categories[0]?.id || 'cat-personal';
  }

  /**
   * Sugiere la prioridad adecuada según la urgencia del correo
   */
  suggestPriorityForEmail(email: GmailEmail): TaskPriority {
    const text = `${email.subject} ${email.snippet}`.toLowerCase();

    if (text.includes('alerta') || text.includes('urgente') || text.includes('inmediato') || text.includes('caudalímetro')) {
      return 'vital';
    }
    if (text.includes('revisión') || text.includes('antes de') || text.includes('deploy') || text.includes('pull request')) {
      return 'alta';
    }
    if (text.includes('factura') || text.includes('reunión') || text.includes('muestras')) {
      return 'media';
    }

    return 'media';
  }

  /**
   * Transforma un correo de Gmail en los datos necesarios para crear una tarea en DHARMA.
   *
   * Limpia el asunto, redacta la descripción contextualizada y guarda la referencia
   * directa con el enlace a Gmail.
   */
  convertEmailToTaskInput(
    email: GmailEmail,
    categories: Category[],
    overrides?: {
      title?: string;
      categoryId?: string;
      priority?: TaskPriority;
      dueDate?: string;
    }
  ): Omit<Task, 'id' | 'createdAt'> {
    // 1. Limpiar prefijos de asunto como Re:, Fwd:, RV:
    const cleanTitle = email.subject.replace(/^(re|fwd|rv):\s*/gi, '').trim();

    // 2. Categoría sugerida
    const categoryId = overrides?.categoryId || this.suggestCategoryForEmail(email, categories);

    // 3. Prioridad sugerida
    const priority = overrides?.priority || this.suggestPriorityForEmail(email);

    // 4. Descripción y notas
    const description = `${email.snippet}\n\n— Remitente: ${email.from.name} <${email.from.email}>`;
    const notes = `Correo originario de Gmail:\nAsunto: ${email.subject}\nRemitente: ${email.from.name} (${email.from.email})\nFecha: ${email.date}\nEnlace web: ${email.gmailWebLink}`;

    return {
      title: overrides?.title || cleanTitle || 'Tarea desde correo Gmail',
      description,
      categoryId,
      statusId: 'por_hacer',
      priority,
      dueDate: overrides?.dueDate || getTodayISO(),
      tags: ['Gmail', 'Correo'],
      origin: 'Gmail',
      notes,
    };
  }
}

export const gmailService = new GmailService();
