import type { Note } from '../types';

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Protocolo de Muestreo Ambiental y Calidad de Aire',
    content: 'Guía técnica para la calibración de sensores de partículas en estaciones de campo. Verificar siempre el nivel de batería y calibrar el sensor óptico antes de iniciar el ciclo de medición.',
    categoryId: 'cat-eco',
    tags: ['Medio Ambiente', 'Protocolo', 'Sensores'],
    links: [
      { id: 'nl-1', title: 'Normativa de Calidad Ambiental (PDF)', url: 'https://ambiente.gob.ec/normativa' },
      { id: 'nl-2', title: 'Dashboard de Estaciones en Tiempo Real', url: 'https://sensores.ecoingenieria.io' },
    ],
    checklist: [
      { id: 'nc-1', title: 'Comprobar estanqueidad de la carcasa', completed: true },
      { id: 'nc-2', title: 'Validar transmisión LoRaWAN cada 15 min', completed: true },
      { id: 'nc-3', title: 'Firmar acta de inspección con el cliente', completed: false },
    ],
    isFavorite: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'note-2',
    title: 'Metodología de Dinámicas para Talleres Comunitarios',
    content: 'Estructura recomendada para sesiones de participación ciudadana: 1) Rompehielos (10 min), 2) Mapeo colectivo de necesidades (30 min), 3) Ideación de soluciones prioritarias (35 min), y 4) Compromisos de seguimiento (15 min).',
    categoryId: 'cat-ocupamor',
    tags: ['Comunidad', 'Talleres', 'Facilitación'],
    links: [
      { id: 'nl-3', title: 'Guía de facilitación participativa', url: 'https://ocupamor.org/guias' },
    ],
    checklist: [
      { id: 'nc-4', title: 'Imprimir plantillas de mapeo', completed: true },
      { id: 'nc-5', title: 'Preparar post-its y marcadores ecológicos', completed: false },
      { id: 'nc-6', title: 'Designar responsable de fotografía y relatoría', completed: true },
    ],
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'note-3',
    title: 'Directrices de Estilo Visual y Arquitectura DHARMA',
    content: 'Principios rectores del sistema: estética pastel, orgánica y espaciosa. Evitar tonos corporativos fríos y divisiones con líneas rígidas. Los radios de curvatura deben oscilar entre 20px y 28px. Paleta con fondos suaves (.bgSoft) y acentos equilibrados.',
    categoryId: 'cat-trabajo-personal',
    tags: ['Diseño', 'Tokens', 'Arquitectura'],
    links: [
      { id: 'nl-4', title: 'Tokens de diseño centralizados', url: 'https://github.com/dharma/design-tokens' },
      { id: 'nl-5', title: 'Referencia visual Zen / Calm Tech', url: 'https://calmtech.com' },
    ],
    checklist: [
      { id: 'nc-7', title: 'Definir paleta HSL balanceada', completed: true },
      { id: 'nc-8', title: 'Configurar microanimaciones suaves', completed: true },
      { id: 'nc-9', title: 'Validar contraste WCAG AA en modo claro', completed: true },
    ],
    isFavorite: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'note-4',
    title: 'Rutas Críticas y Tiempos de Despacho en Guayas',
    content: 'Puntos de congestión habituales en el puente de la Unidad Nacional entre 07:30 y 09:00. Priorizar despachos hacia Samborondón y Durán antes de las 07:00 o después de las 10:00.',
    categoryId: 'cat-sologuayas',
    tags: ['Logística', 'Operaciones', 'Rutas'],
    links: [
      { id: 'nl-6', title: 'Estado de vías en tiempo real', url: 'https://transito.guayas.gob.ec' },
    ],
    checklist: [
      { id: 'nc-10', title: 'Revisión técnica vehicular lunes a primera hora', completed: true },
      { id: 'nc-11', title: 'Confirmar guías de despacho digitales', completed: false },
    ],
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'note-5',
    title: 'Lista de Lecturas y Hábitos para Enfoque Profundo',
    content: 'Ideas extraídas de "Deep Work" y "Atomic Habits": 1) Bloques ininterrumpidos de 90 minutos, 2) Teléfono en otra habitación durante sesiones creativas, 3) Cierre formal de jornada laboral a las 18:30 con revisión de pendientes para el día siguiente.',
    categoryId: 'cat-personal',
    tags: ['Productividad', 'Hábitos', 'Lectura'],
    links: [
      { id: 'nl-7', title: 'Resumen gráfico de Hábitos Atómicos', url: 'https://jamesclear.com/atomic-habits' },
    ],
    checklist: [
      { id: 'nc-12', title: 'Caminar 20 minutos al aire libre diariamente', completed: true },
      { id: 'nc-13', title: 'Bloque matutino sin revisar correo ni mensajería', completed: true },
      { id: 'nc-14', title: 'Bitácora nocturna de 3 logros del día', completed: false },
    ],
    isFavorite: true,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];
