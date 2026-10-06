/**
 * Definiciones de tipos para Google Drive (FASE 11)
 */

export interface GoogleDriveOwner {
  displayName?: string;
  emailAddress?: string;
  photoLink?: string;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  iconLink?: string;
  thumbnailLink?: string;
  modifiedTime?: string;
  size?: string;
  owners?: GoogleDriveOwner[];
  shared?: boolean;
  starred?: boolean;
}

export type GoogleDriveFilterCategory = 
  | 'all' 
  | 'document' 
  | 'spreadsheet' 
  | 'presentation' 
  | 'pdf' 
  | 'folder' 
  | 'media';

export type GoogleDriveStatus = 'disconnected' | 'connecting' | 'connected' | 'searching' | 'error';

export interface GoogleDriveSearchOptions {
  query?: string;
  category?: GoogleDriveFilterCategory;
  pageSize?: number;
}
