import type { Station, StationId } from '../types';

export const STATIONS: Record<StationId, Station> = {
  trabajo: {
    id: 'trabajo',
    name: 'Trabajo & Proyectos',
    code: 'EST-01',
    iconName: 'Briefcase',
    color: '#0D9488', // Teal principal
    bgSoft: '#F0FDFA',
    borderColor: '#CCFBF1',
    textColor: '#0F766E',
    description: 'Operaciones profesionales, entregas y compromisos clave.',
  },
  personal: {
    id: 'personal',
    name: 'Vida Personal',
    code: 'EST-02',
    iconName: 'User',
    color: '#8B5CF6', // Lavanda
    bgSoft: '#F5F3FF',
    borderColor: '#EDE9FE',
    textColor: '#6D28D9',
    description: 'Gestión del hogar, finanzas y compromisos personales.',
  },
  enfoque: {
    id: 'enfoque',
    name: 'Módulo Enfoque',
    code: 'EST-03',
    iconName: 'Sparkles',
    color: '#D97706', // Amarillo suave / Amber
    bgSoft: '#FFFBEB',
    borderColor: '#FEF3C7',
    textColor: '#B45309',
    description: 'Sesiones de concentración profunda y trabajo creativo.',
  },
  bienestar: {
    id: 'bienestar',
    name: 'Regeneración & Salud',
    code: 'EST-04',
    iconName: 'Heart',
    color: '#16A34A', // Verde suave
    bgSoft: '#F0FDF4',
    borderColor: '#DCFCE7',
    textColor: '#15803D',
    description: 'Hábitos diarios, ejercicio, descanso y balance.',
  },
  protocolos: {
    id: 'protocolos',
    name: 'Sistemas & Rutinas',
    code: 'EST-05',
    iconName: 'Layers',
    color: '#0284C7', // Azul cielo
    bgSoft: '#F0F9FF',
    borderColor: '#E0F2FE',
    textColor: '#0369A1',
    description: 'Procedimientos periódicos y mantenimiento del sistema.',
  },
};

export const STATIONS_LIST: Station[] = Object.values(STATIONS);
