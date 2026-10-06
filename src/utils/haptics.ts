/**
 * Utilidad de Feedback Háptico Táctil para Dispositivos Móviles (Android / PWA)
 */
export function triggerHaptic(durationMs: number | number[] = 15) {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(durationMs);
    }
  } catch (_) {
    // Silently ignore if not supported or disabled by user preferences
  }
}
