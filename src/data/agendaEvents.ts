import type { AgendaEvent } from '../types';
import { toISODate } from '../utils/dateUtils';

// Calculamos fechas relativas a hoy para que la demo siempre se vea con datos en el mes/semana actual
const today = new Date();

const getRelativeDate = (offsetDays: number): string => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return toISODate(d);
};

export const INITIAL_AGENDA_EVENTS: AgendaEvent[] = [
  {
    id: 'evt-1',
    title: 'Sincronización de producto y arquitectura',
    description: 'Revisión técnica de los componentes de diseño y flujo de datos.',
    time: '10:00 - 10:45',
    date: 'Hoy',
    location: 'Llamada remota',
    categoryId: 'cat-eco',
    type: 'evento',
    isCompleted: false,
  },
  {
    id: 'evt-2',
    title: 'Pausa de regeneración y calma visual',
    description: 'Desconexión de monitores, caminata suave y respiración.',
    time: '13:30 - 14:00',
    date: 'Hoy',
    location: 'Sin pantallas',
    categoryId: 'cat-ocio',
    type: 'recordatorio',
    isCompleted: false,
  },
  {
    id: 'evt-3',
    title: 'Bloque de Enfoque Profundo (Deep Work)',
    description: 'Sesión de código sin interrupciones para el módulo visual.',
    time: '16:00 - 17:30',
    date: 'Hoy',
    location: 'Estación personal',
    categoryId: 'cat-trabajo-personal',
    type: 'evento',
    isCompleted: false,
  },
  {
    id: 'evt-4',
    title: 'Recordatorio: Enviar reporte de calidad de agua',
    description: 'Adjuntar métricas del último muestreo de Eco Ingeniería.',
    time: '09:00',
    date: 'Mañana',
    location: 'Correo electrónico',
    categoryId: 'cat-eco',
    type: 'recordatorio',
    isCompleted: false,
  },
  {
    id: 'evt-5',
    title: 'Reunión de coordinación comunitaria',
    description: 'Planificación del taller de integración de Ocupamor.',
    time: '15:00 - 16:30',
    date: 'Mañana',
    location: 'Sala de conferencias',
    categoryId: 'cat-ocupamor',
    type: 'evento',
    isCompleted: false,
  },
  {
    id: 'evt-6',
    title: 'Despacho logístico y balance de guías',
    description: 'Consolidación de envíos semanales en Guayas.',
    time: '11:00 - 12:30',
    date: getRelativeDate(2),
    location: 'Bodega Central',
    categoryId: 'cat-sologuayas',
    type: 'evento',
    isCompleted: false,
  },
  {
    id: 'evt-7',
    title: 'Recordatorio: Sesión de lectura y desconexión',
    description: 'Capítulo semanal sobre sistemas y filosofía zen.',
    time: '20:30',
    date: getRelativeDate(3),
    location: 'Espacio de descanso',
    categoryId: 'cat-ocio',
    type: 'recordatorio',
    isCompleted: false,
  },
  {
    id: 'evt-8',
    title: 'Planificación de sprint Team Nox',
    description: 'Alineación de objetivos y backlog del equipo.',
    time: '14:00 - 15:30',
    date: getRelativeDate(4),
    location: 'Canal de voz Team Nox',
    categoryId: 'cat-team-nox',
    type: 'evento',
    isCompleted: false,
  },
  {
    id: 'evt-9',
    title: 'Revisión médica preventiva y rutina física',
    description: 'Control de rutina y calibración personal.',
    time: '08:30 - 09:30',
    date: getRelativeDate(6),
    location: 'Centro de salud',
    categoryId: 'cat-personal',
    type: 'evento',
    isCompleted: false,
  },
  {
    id: 'evt-10',
    title: 'Recordatorio: Copia de seguridad del sistema',
    description: 'Exportar respaldo JSON de tareas y bitácora local.',
    time: '19:00',
    date: getRelativeDate(8),
    location: 'Centro de Mando',
    categoryId: 'cat-otros',
    type: 'recordatorio',
    isCompleted: false,
  },
];
