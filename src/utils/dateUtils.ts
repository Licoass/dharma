/**
 * Utilidades de fecha y tiempo para el Calendario DHARMA
 */

export const MONTH_NAMES_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export const DAY_NAMES_SHORT_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const DAY_NAMES_FULL_ES = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

/**
 * Formatea un objeto Date a string ISO YYYY-MM-DD
 */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Devuelve la fecha de hoy en formato YYYY-MM-DD
 */
export function getTodayISO(): string {
  return toISODate(new Date());
}

/**
 * Normaliza cualquier string de fecha ('Hoy', 'Mañana', 'YYYY-MM-DD') a formato YYYY-MM-DD
 */
export function normalizeDateToISO(dateStr?: string): string {
  if (!dateStr) return getTodayISO();

  const lower = dateStr.trim().toLowerCase();
  const today = new Date();

  if (lower === 'hoy') {
    return toISODate(today);
  }

  if (lower === 'mañana' || lower === 'manana') {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return toISODate(tomorrow);
  }

  if (lower === 'ayer') {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return toISODate(yesterday);
  }

  // Comprobar si ya es YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) {
    return dateStr.trim();
  }

  // Intentar parsear con Date
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return toISODate(parsed);
  }

  return getTodayISO();
}

/**
 * Formatea una fecha ISO a texto amigable ("Hoy · 6 de Octubre", "Martes, 6 de Octubre")
 */
export function formatFriendlyDate(isoDate: string): string {
  const normalized = normalizeDateToISO(isoDate);
  const todayISO = getTodayISO();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = toISODate(tomorrow);

  const [y, m, d] = normalized.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayOfWeekIndex = (dateObj.getDay() + 6) % 7; // Lunes = 0, Domingo = 6
  const dayName = DAY_NAMES_FULL_ES[dayOfWeekIndex];
  const monthName = MONTH_NAMES_ES[m - 1];

  if (normalized === todayISO) {
    return `Hoy · ${d} de ${monthName}`;
  }

  if (normalized === tomorrowISO) {
    return `Mañana · ${d} de ${monthName}`;
  }

  return `${dayName}, ${d} de ${monthName}`;
}

export interface CalendarDayInfo {
  date: Date;
  isoDate: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayOfWeek: number; // 0 = Lunes, 6 = Domingo
}

/**
 * Genera la cuadrícula de días para el mes solicitado (incluyendo relleno anterior y posterior)
 */
export function getMonthGrid(year: number, month: number): CalendarDayInfo[] {
  const todayISO = getTodayISO();

  // Primer día del mes solicitado
  const firstDayOfMonth = new Date(year, month, 1);
  // (getDay(): 0=Domingo, 1=Lunes, ... 6=Sábado). Convertir a Lunes=0 ... Domingo=6
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  // Número de días en el mes
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

  // Número de días en el mes anterior
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: CalendarDayInfo[] = [];

  // Días del mes previo
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDayNumber = daysInPrevMonth - i;
    const date = new Date(year, month - 1, prevDayNumber);
    const isoDate = toISODate(date);
    days.push({
      date,
      isoDate,
      dayNumber: prevDayNumber,
      isCurrentMonth: false,
      isToday: isoDate === todayISO,
      dayOfWeek: (date.getDay() + 6) % 7,
    });
  }

  // Días del mes actual
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    const date = new Date(year, month, i);
    const isoDate = toISODate(date);
    days.push({
      date,
      isoDate,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: isoDate === todayISO,
      dayOfWeek: (date.getDay() + 6) % 7,
    });
  }

  // Días del mes siguiente para completar múltiplos de 7 (35 o 42 celdas)
  const remainingCells = (7 - (days.length % 7)) % 7;
  // Asegurar al menos 35 o 42 filas completas
  const targetTotal = days.length + remainingCells < 35 ? 35 : days.length + remainingCells;
  const nextMonthCount = targetTotal - days.length;

  for (let i = 1; i <= nextMonthCount; i++) {
    const date = new Date(year, month + 1, i);
    const isoDate = toISODate(date);
    days.push({
      date,
      isoDate,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: isoDate === todayISO,
      dayOfWeek: (date.getDay() + 6) % 7,
    });
  }

  return days;
}

export interface WeekDayInfo {
  date: Date;
  isoDate: string;
  dayNumber: number;
  dayNameShort: string;
  dayNameFull: string;
  isToday: boolean;
}

/**
 * Genera los 7 días de la semana (Lunes a Domingo) para una fecha dada
 */
export function getWeekDays(referenceDate: Date): WeekDayInfo[] {
  const todayISO = getTodayISO();
  const dayOfWeek = (referenceDate.getDay() + 6) % 7; // 0 = Lunes

  // Lunes de la semana
  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() - dayOfWeek);

  const week: WeekDayInfo[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const isoDate = toISODate(d);

    week.push({
      date: d,
      isoDate,
      dayNumber: d.getDate(),
      dayNameShort: DAY_NAMES_SHORT_ES[i],
      dayNameFull: DAY_NAMES_FULL_ES[i],
      isToday: isoDate === todayISO,
    });
  }

  return week;
}
