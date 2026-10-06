import type { TaskStatusItem } from '../types';

export const INITIAL_STATUSES: TaskStatusItem[] = [
  {
    id: 'por_hacer',
    name: 'Por hacer',
    color: '#8C8578',
    bgSoft: '#EFEAE0',
    textColor: '#171717',
    order: 0,
  },
  {
    id: 'en_proceso',
    name: 'En proceso',
    color: '#B9A7F7',
    bgSoft: '#F5F2FE',
    textColor: '#171717',
    order: 1,
  },
  {
    id: 'en_espera',
    name: 'En espera',
    color: '#FFD84D',
    bgSoft: '#FFFBEA',
    textColor: '#171717',
    order: 2,
  },
  {
    id: 'completado',
    name: 'Completado',
    color: '#A8D8A0',
    bgSoft: '#F2FAF0',
    textColor: '#171717',
    order: 3,
  },
];
