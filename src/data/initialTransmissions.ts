import type { Transmission } from '../types';

export const INITIAL_TRANSMISSIONS: Transmission[] = [
  {
    id: 'tx-001',
    type: 'texto',
    title: 'Plan de mantenimiento hídrico',
    content: 'Revisar lecturas de caudal en la estación hidroeléctrica y coordinar con el equipo de Eco Ingeniería antes de la inspección del jueves.',
    status: 'nueva',
    frequencyCode: 'FRQ-108.4',
    signalStrength: 98,
    createdAt: new Date(Date.now() - 1000 * 60 * 24).toISOString(), // hace 24 mins
  },
  {
    id: 'tx-002',
    type: 'enlace',
    title: 'Paper sobre arquitecturas distribuidas',
    content: 'Referencia técnica compartida por el laboratorio de investigación sobre consenso y resiliencia en sistemas desconectados.',
    url: 'https://arxiv.org/abs/2312.00752',
    status: 'nueva',
    frequencyCode: 'NET-44.2',
    signalStrength: 94,
    createdAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(), // hace casi 2h
  },
  {
    id: 'tx-003',
    type: 'audio',
    title: 'Nota de voz: Protocolo de suministros',
    content: 'Grabación de voz entrante: revisión de stock de baterías de respaldo para los sensores de campo y cotización de filtros solares.',
    durationSeconds: 46,
    status: 'procesando',
    frequencyCode: 'VOC-88.1',
    signalStrength: 91,
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // hace 6h
  },
  {
    id: 'tx-004',
    type: 'texto',
    title: 'Confirmación de repuestos Solo Guayas',
    content: 'El pedido de cables de alta tensión y conectores herméticos fue confirmado por el proveedor para entrega el viernes.',
    status: 'procesada',
    frequencyCode: 'FRQ-104.9',
    signalStrength: 99,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // ayer
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: 'tx-005',
    type: 'imagen',
    title: 'Esquema preliminar de panel fotovoltaico',
    content: 'Fotografía capturada del boceto en libreta sobre la inclinación óptima de paneles para la estación secundaria.',
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    status: 'procesada',
    frequencyCode: 'IMG-92.6',
    signalStrength: 96,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // hace 2 días
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: 'tx-006',
    type: 'texto',
    title: 'Archivo de telemetría de ciclo anterior',
    content: 'Reporte consolidado de horas operativas y registros meteorológicos archivados tras completar la fase de calibración.',
    status: 'archivada',
    frequencyCode: 'ARC-01.0',
    signalStrength: 88,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // hace 4 días
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];
