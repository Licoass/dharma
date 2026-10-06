import type { TaskStatusItem } from '../types';

export const INITIAL_STATUSES: TaskStatusItem[] = [
  {
    id: 'por_hacer',
    name: 'Por hacer',
    color: '#94A3B8',
    bgSoft: '#F1F5F9',
    textColor: '#475569',
    order: 0,
  },
  {
    id: 'en_proceso',
    name: 'En proceso',
    color: '#0D9488',
    bgSoft: '#E8F6F4',
    textColor: '#177468',
    order: 1,
  },
  {
    id: 'en_espera',
    name: 'En espera',
    color: '#D97706',
    bgSoft: '#FEF6E9',
    textColor: '#8E5B18',
    order: 2,
  },
  {
    id: 'completado',
    name: 'Completado',
    color: '#16A34A',
    bgSoft: '#EEF6F0',
    textColor: '#376841',
    order: 3,
  },
];
