/**
 * Definiciones de tipos para Google OAuth y Google Calendar (FASE 10)
 */

export interface GoogleCalendarDateTime {
  dateTime?: string; // ISO 8601 string, ej: 2026-10-06T10:00:00-04:00
  date?: string;     // YYYY-MM-DD para eventos de todo el día
  timeZone?: string;
}

export interface GoogleCalendarAttendee {
  email: string;
  displayName?: string;
  responseStatus?: 'accepted' | 'declined' | 'tentative' | 'needsAction';
  self?: boolean;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: GoogleCalendarDateTime;
  end: GoogleCalendarDateTime;
  location?: string;
  htmlLink?: string;
  hangoutLink?: string; // Enlace directo a Google Meet
  status?: 'confirmed' | 'tentative' | 'cancelled';
  creator?: {
    email?: string;
    displayName?: string;
  };
  organizer?: {
    email?: string;
    displayName?: string;
  };
  attendees?: GoogleCalendarAttendee[];
  created?: string;
  updated?: string;
  isReadOnly: true; // En Fase 10 siempre es solo lectura
}

/**
 * Esquema de datos para crear o actualizar eventos en Google Calendar.
 * Mantiene la arquitectura preparada para las futuras fases de escritura (CRUD completo).
 */
export interface GoogleCalendarEventInput {
  summary: string;
  description?: string;
  start: GoogleCalendarDateTime;
  end: GoogleCalendarDateTime;
  location?: string;
  attendees?: { email: string }[];
}

export interface GoogleOAuthToken {
  accessToken: string;
  tokenType: string;
  expiresIn?: number;
  scope?: string;
  expiresAt: number; // Timestamp en milisegundos
}

export interface GoogleUser {
  email: string;
  name?: string;
  picture?: string;
  id?: string;
}

export type GoogleSyncStatus = 'disconnected' | 'connecting' | 'connected' | 'syncing' | 'error';

export interface GoogleCalendarState {
  status: GoogleSyncStatus;
  user: GoogleUser | null;
  events: GoogleCalendarEvent[];
  lastSyncedAt: string | null;
  errorMessage: string | null;
  isDemoMode: boolean;
}
