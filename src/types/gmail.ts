/**
 * Definiciones de tipos para Integración con Gmail (FASE 12)
 *
 * Filosofía de integración:
 * - DHARMA no es un cliente de correo electrónico.
 * - Gmail sigue siendo Gmail.
 * - DHARMA utiliza Gmail exclusivamente como FUENTE DE INFORMACIÓN
 *   para consultar correos y transformarlos en tareas accionables.
 */

export interface GmailSender {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface GmailEmail {
  id: string;
  threadId?: string;
  subject: string;
  from: GmailSender;
  to?: string;
  date: string; // Fecha en formato ISO o legible
  snippet: string; // Resumen o extracto inicial del mensaje
  bodyText?: string; // Contenido legible básico del correo
  isUnread?: boolean;
  isStarred?: boolean;
  isImportant?: boolean;
  labels?: string[]; // ej: ['INBOX', 'IMPORTANT', 'UNREAD']
  hasAttachments?: boolean;
  gmailWebLink: string; // Enlace directo a https://mail.google.com/...
}

export type GmailLabelFilter = 'ALL' | 'INBOX' | 'UNREAD' | 'IMPORTANT' | 'STARRED';

export interface GmailSearchOptions {
  query?: string;
  labelFilter?: GmailLabelFilter;
  maxResults?: number;
}

export type GmailStatus = 'disconnected' | 'connecting' | 'connected' | 'searching' | 'error';
