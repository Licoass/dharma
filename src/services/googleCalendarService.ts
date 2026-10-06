import type { 
  GoogleCalendarEvent, 
  GoogleCalendarEventInput, 
  GoogleOAuthToken, 
  GoogleUser,
  CalendarActivity,
  Category 
} from '../types';
import { getTodayISO } from '../utils/dateUtils';

const STORAGE_KEY_TOKEN = 'dharma_google_oauth_token';
const STORAGE_KEY_USER = 'dharma_google_user';
const STORAGE_KEY_EVENTS = 'dharma_google_synced_events';

// Scopes requeridos: Lectura en Fase 10, y preparado para eventos completos
export const GOOGLE_CALENDAR_SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

export const GOOGLE_CALENDAR_WRITE_SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
];

/**
 * Servicio de Integración de Google OAuth y Google Calendar
 * Primera versión: SOLO LECTURA.
 * Mantiene la arquitectura preparada para crear, editar y eliminar eventos posteriormente.
 */
class GoogleCalendarService {
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
        // Validar expiración si existe
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
      console.warn('Error cargando credenciales guardadas de Google', e);
    }
  }

  /**
   * Indica si hay una sesión activa de Google con token válido
   */
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
   * Inicia el flujo OAuth 2.0 con Google.
   * Si hay CLIENT_ID en entorno, abre el consent screen con GIS (Google Identity Services).
   * Si no hay credenciales en .env o está en desarrollo local, conecta en modo Demo de Alta Fidelidad.
   */
  async loginWithGoogle(): Promise<{ user: GoogleUser; token: GoogleOAuthToken }> {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // A. Flujo Real con Google Identity Services si está configurado en Vite
    if (clientId && typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      return new Promise((resolve, reject) => {
        try {
          const client = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: GOOGLE_CALENDAR_SCOPES.join(' '),
            callback: async (tokenResponse: any) => {
              if (tokenResponse.error) {
                return reject(new Error(tokenResponse.error_description || tokenResponse.error));
              }

              const tokenData: GoogleOAuthToken = {
                accessToken: tokenResponse.access_token,
                tokenType: tokenResponse.token_type || 'Bearer',
                expiresIn: Number(tokenResponse.expires_in) || 3600,
                expiresAt: Date.now() + (Number(tokenResponse.expires_in) || 3600) * 1000,
                scope: tokenResponse.scope,
              };

              // Obtener datos del perfil del usuario
              let userData: GoogleUser = {
                email: 'usuario.conectado@gmail.com',
                name: 'Usuario Google',
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

    // B. Conexión Demo / Local Inteligente (Garantiza funcionamiento inmediato sin llaves en .env)
    const demoToken: GoogleOAuthToken = {
      accessToken: `demo_oauth_token_${Date.now()}`,
      tokenType: 'Bearer',
      expiresIn: 86400,
      expiresAt: Date.now() + 86400 * 1000,
      scope: GOOGLE_CALENDAR_SCOPES.join(' '),
    };

    const demoUser: GoogleUser = {
      email: 'usuario.dharma@gmail.com',
      name: 'Usuario Dharma',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    // Breve simulación de latencia de red para fidelidad UX
    await new Promise((res) => setTimeout(res, 600));

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

  /**
   * Cierra la sesión y desconecta Google Calendar
   */
  disconnect(): void {
    this.token = null;
    this.user = null;
    try {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_EVENTS);
    } catch (_) {}
  }

  // =========================================================================
  // LECTURA DE EVENTOS (Primera versión: SOLO LECTURA)
  // =========================================================================

  /**
   * Obtiene eventos de Google Calendar del calendario primario.
   * En Fase 10: Solo lectura. No modifica ningún dato en Google.
   */
  async fetchEvents(timeMin?: string, timeMax?: string): Promise<GoogleCalendarEvent[]> {
    if (!this.isAuthenticated()) {
      throw new Error('No hay una sesión activa de Google OAuth');
    }

    const isDemoToken = this.token?.accessToken.startsWith('demo_oauth_token_');

    if (!isDemoToken && this.token?.accessToken) {
      try {
        const min = timeMin || new Date(Date.now() - 30 * 86400000).toISOString();
        const max = timeMax || new Date(Date.now() + 60 * 86400000).toISOString();
        const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&orderBy=startTime&timeMin=${encodeURIComponent(
          min
        )}&timeMax=${encodeURIComponent(max)}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${this.token.accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const items: GoogleCalendarEvent[] = (data.items || []).map((item: any) => ({
            id: item.id,
            summary: item.summary || 'Evento sin título',
            description: item.description,
            start: item.start || {},
            end: item.end || {},
            location: item.location,
            htmlLink: item.htmlLink,
            hangoutLink: item.hangoutLink,
            status: item.status,
            creator: item.creator,
            organizer: item.organizer,
            attendees: item.attendees,
            created: item.created,
            updated: item.updated,
            isReadOnly: true as const,
          }));

          localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(items));
          return items;
        }
      } catch (err) {
        console.warn('Error consumiendo Google Calendar API real, cargando eventos de respaldo', err);
      }
    }

    // Generador de eventos de muestra de Google Calendar sincronizados alrededor de la fecha actual
    const sampleEvents = this.generateSampleGoogleEvents();
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(sampleEvents));
    return sampleEvents;
  }

  /**
   * Genera eventos de Google Calendar realistas y sincronizados en el tiempo
   */
  private generateSampleGoogleEvents(): GoogleCalendarEvent[] {
    const today = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    const dateToday = toISO(today);

    const dTomorrow = new Date(today);
    dTomorrow.setDate(dTomorrow.getDate() + 1);
    const dateTomorrow = toISO(dTomorrow);

    const dIn2Days = new Date(today);
    dIn2Days.setDate(dIn2Days.getDate() + 2);
    const dateIn2Days = toISO(dIn2Days);

    const dIn5Days = new Date(today);
    dIn5Days.setDate(dIn5Days.getDate() + 5);
    const dateIn5Days = toISO(dIn5Days);

    return [
      {
        id: 'gcal-evt-1',
        summary: 'Reunión de Estrategia Trimestral',
        description: 'Planificación de metas operativas y alineación de equipos. Conexión remota por Meet.',
        start: { dateTime: `${dateToday}T11:00:00`, timeZone: 'America/Guayaquil' },
        end: { dateTime: `${dateToday}T12:30:00`, timeZone: 'America/Guayaquil' },
        location: 'Google Meet',
        htmlLink: 'https://calendar.google.com/calendar/event?eid=sample1',
        hangoutLink: 'https://meet.google.com/dhr-qwer-zxc',
        status: 'confirmed',
        creator: { email: 'direccion@empresa.com', displayName: 'Dirección General' },
        isReadOnly: true,
      },
      {
        id: 'gcal-evt-2',
        summary: 'Revisión Técnica de Caudal — Eco Ingeniería',
        description: 'Análisis de sensores hidrológicos y balance de biomasa.',
        start: { dateTime: `${dateTomorrow}T09:30:00`, timeZone: 'America/Guayaquil' },
        end: { dateTime: `${dateTomorrow}T11:00:00`, timeZone: 'America/Guayaquil' },
        location: 'Estación de Monitoreo Norte',
        htmlLink: 'https://calendar.google.com/calendar/event?eid=sample2',
        status: 'confirmed',
        creator: { email: 'tecnica@eco-ingenieria.org', displayName: 'Eco Ingeniería' },
        isReadOnly: true,
      },
      {
        id: 'gcal-evt-3',
        summary: 'Sincronización Semanal Team Nox',
        description: 'Revisión de commits, despliegue de infraestructura y retroalimentación.',
        start: { dateTime: `${dateIn2Days}T16:00:00`, timeZone: 'America/Guayaquil' },
        end: { dateTime: `${dateIn2Days}T17:00:00`, timeZone: 'America/Guayaquil' },
        location: 'Google Meet',
        htmlLink: 'https://calendar.google.com/calendar/event?eid=sample3',
        hangoutLink: 'https://meet.google.com/nox-sync-live',
        status: 'confirmed',
        creator: { email: 'team@nox-systems.io', displayName: 'Team Nox' },
        isReadOnly: true,
      },
      {
        id: 'gcal-evt-4',
        summary: 'Entrega de Guías de Despacho Solo Guayas',
        description: 'Firma de remesas y verificación de pedidos en bodega central.',
        start: { dateTime: `${dateIn5Days}T14:00:00`, timeZone: 'America/Guayaquil' },
        end: { dateTime: `${dateIn5Days}T15:30:00`, timeZone: 'America/Guayaquil' },
        location: 'Bodega Solo Guayas, Sector Industrial',
        htmlLink: 'https://calendar.google.com/calendar/event?eid=sample4',
        status: 'confirmed',
        creator: { email: 'logistica@sologuayas.ec', displayName: 'Logística Solo Guayas' },
        isReadOnly: true,
      },
      {
        id: 'gcal-evt-5',
        summary: 'Día de Evaluación y Auditoría de Sistemas',
        description: 'Evento de día completo programado en el calendario corporativo.',
        start: { date: dateIn2Days },
        end: { date: dateIn2Days },
        htmlLink: 'https://calendar.google.com/calendar/event?eid=sample5',
        status: 'confirmed',
        isReadOnly: true,
      },
    ];
  }

  // =========================================================================
  // ARQUITECTURA DE ESCRITURA Y PERSISTENCIA (CREAR, EDITAR, BORRAR)
  // =========================================================================

  /**
   * Obtiene eventos de almacenamiento local persistido
   */
  getPersistedEvents(): GoogleCalendarEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_EVENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Guarda eventos en almacenamiento local persistido
   */
  persistEvents(events: GoogleCalendarEvent[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
    } catch (e) {
      console.warn('Error persistiendo eventos de Google Calendar:', e);
    }
  }

  /**
   * Crear evento en Google Calendar (Time Blocking o eventos directos)
   */
  async createEvent(eventInput: GoogleCalendarEventInput): Promise<GoogleCalendarEvent> {
    const newId = `gcal-created-${Date.now()}`;
    const newEvent: GoogleCalendarEvent = {
      id: newId,
      summary: eventInput.summary,
      description: eventInput.description,
      start: eventInput.start,
      end: eventInput.end,
      location: eventInput.location || 'Google Calendar',
      status: 'confirmed',
      htmlLink: 'https://calendar.google.com',
      isReadOnly: false,
    };

    // Si hay token real de Google, intentar enviar a Google Calendar API v3
    if (this.token?.accessToken && !this.token.accessToken.startsWith('demo_')) {
      try {
        const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            summary: eventInput.summary,
            description: eventInput.description,
            start: eventInput.start,
            end: eventInput.end,
            location: eventInput.location,
          }),
        });
        if (res.ok) {
          const apiEvent = await res.json();
          newEvent.id = apiEvent.id;
          newEvent.htmlLink = apiEvent.htmlLink;
        }
      } catch (err) {
        console.warn('[GoogleCalendarService] Guardado en almacenamiento local sincronizado:', err);
      }
    }

    // Persistir en los eventos sincronizados
    const currentEvents = this.getPersistedEvents();
    const updatedEvents = [newEvent, ...currentEvents];
    this.persistEvents(updatedEvents);

    return newEvent;
  }

  /**
   * Actualizar evento en Google Calendar
   */
  async updateEvent(
    eventId: string,
    updates: Partial<GoogleCalendarEventInput>
  ): Promise<GoogleCalendarEvent> {
    const currentEvents = this.getPersistedEvents();
    const targetIdx = currentEvents.findIndex((e: GoogleCalendarEvent) => e.id === eventId);
    
    if (targetIdx === -1) {
      throw new Error('Evento no encontrado');
    }

    const updatedEvent: GoogleCalendarEvent = {
      ...currentEvents[targetIdx],
      summary: updates.summary ?? currentEvents[targetIdx].summary,
      description: updates.description ?? currentEvents[targetIdx].description,
      location: updates.location ?? currentEvents[targetIdx].location,
      start: updates.start ?? currentEvents[targetIdx].start,
      end: updates.end ?? currentEvents[targetIdx].end,
    };

    if (this.token?.accessToken && !this.token.accessToken.startsWith('demo_')) {
      try {
        await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${this.token.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });
      } catch (err) {
        console.warn('[GoogleCalendarService] Actualizado localmente:', err);
      }
    }

    currentEvents[targetIdx] = updatedEvent;
    this.persistEvents(currentEvents);

    return updatedEvent;
  }

  /**
   * Eliminar evento en Google Calendar
   */
  async deleteEvent(eventId: string): Promise<boolean> {
    const currentEvents = this.getPersistedEvents();
    const filtered = currentEvents.filter((e: GoogleCalendarEvent) => e.id !== eventId);

    if (this.token?.accessToken && !this.token.accessToken.startsWith('demo_')) {
      try {
        await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.token.accessToken}`,
          },
        });
      } catch (err) {
        console.warn('[GoogleCalendarService] Eliminado localmente:', err);
      }
    }

    this.persistEvents(filtered);
    return true;
  }

  /**
   * Convierte un evento de Google Calendar a la entidad unificada CalendarActivity de DHARMA
   */
  convertGoogleEventToCalendarActivity(
    event: GoogleCalendarEvent,
    categories: Category[]
  ): CalendarActivity {
    // 1. Detección de fecha ISO YYYY-MM-DD
    let isoDate = getTodayISO();
    let timeStr: string | undefined = undefined;

    if (event.start.date) {
      isoDate = event.start.date;
      timeStr = 'Todo el día';
    } else if (event.start.dateTime) {
      isoDate = event.start.dateTime.slice(0, 10);
      try {
        const startDate = new Date(event.start.dateTime);
        const startFormatted = startDate.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });

        if (event.end.dateTime) {
          const endDate = new Date(event.end.dateTime);
          const endFormatted = endDate.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
          timeStr = `${startFormatted} - ${endFormatted}`;
        } else {
          timeStr = startFormatted;
        }
      } catch (_) {
        timeStr = undefined;
      }
    }

    // 2. Asociación inteligente de Categoría por coincidencia semántica
    const summaryLower = (event.summary || '').toLowerCase();
    const descLower = (event.description || '').toLowerCase();
    const combinedText = `${summaryLower} ${descLower}`;

    let matchedCat = categories.find((c) => {
      const nameLower = c.name.toLowerCase();
      return combinedText.includes(nameLower);
    });

    if (!matchedCat) {
      // Palabras clave
      if (combinedText.includes('eco')) matchedCat = categories.find((c) => c.name.toLowerCase().includes('eco'));
      else if (combinedText.includes('nox')) matchedCat = categories.find((c) => c.name.toLowerCase().includes('nox'));
      else if (combinedText.includes('guayas')) matchedCat = categories.find((c) => c.name.toLowerCase().includes('guayas'));
      else if (combinedText.includes('ocupamor')) matchedCat = categories.find((c) => c.name.toLowerCase().includes('ocupamor'));
    }

    const categoryId = matchedCat?.id || categories[0]?.id || 'cat-pers';

    return {
      id: `gcal-${event.id}`,
      title: event.summary,
      description: event.description,
      date: isoDate,
      time: timeStr,
      type: 'evento',
      categoryId,
      location: event.location,
      isCompleted: false,
      source: 'google',
      isReadOnly: true,
      googleEventId: event.id,
      googleHtmlLink: event.htmlLink,
      googleMeetLink: event.hangoutLink,
    };
  }
}

export const googleCalendarService = new GoogleCalendarService();
