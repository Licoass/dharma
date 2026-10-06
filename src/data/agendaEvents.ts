import type { AgendaEvent } from '../types';

export const INITIAL_AGENDA_EVENTS: AgendaEvent[] = [
  {
    id: 'evt-1',
    title: 'Sincronización de producto y arquitectura',
    time: '10:00 - 10:45',
    date: 'Hoy',
    location: 'Llamada remota',
    stationId: 'trabajo',
  },
  {
    id: 'evt-2',
    title: 'Pausa de regeneración y calma visual',
    time: '13:30 - 14:00',
    date: 'Hoy',
    location: 'Sin pantallas',
    stationId: 'bienestar',
  },
  {
    id: 'evt-3',
    title: 'Bloque de Enfoque Profundo (Deep Work)',
    time: '16:00 - 17:30',
    date: 'Hoy',
    location: 'Estación personal',
    stationId: 'enfoque',
  },
];
