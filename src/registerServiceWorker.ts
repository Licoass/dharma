/**
 * Registro de Service Worker y Manejador de Instalación Android PWA (FASE 13)
 */

let deferredInstallPrompt: any = null;

export interface PwaInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
}

const listeners = new Set<(state: PwaInstallState) => void>();

let currentState: PwaInstallState = {
  isInstallable: false,
  isInstalled: false,
  isStandalone: typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  ),
};

function notifyListeners() {
  listeners.forEach((listener) => listener({ ...currentState }));
}

/**
 * Suscribirse a cambios en la disponibilidad de instalación PWA
 */
export function subscribePwaInstall(callback: (state: PwaInstallState) => void): () => void {
  listeners.add(callback);
  callback({ ...currentState });
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Solicita al sistema Android mostrar el diálogo nativo de instalación
 */
export async function promptPwaInstall(): Promise<boolean> {
  if (!deferredInstallPrompt) {
    console.info('[PWA] No hay evento de instalación diferido disponible');
    return false;
  }

  try {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    console.log('[PWA] Elección del usuario al instalar:', outcome);

    if (outcome === 'accepted') {
      currentState.isInstalled = true;
      currentState.isInstallable = false;
      deferredInstallPrompt = null;
      notifyListeners();
      return true;
    }
  } catch (err) {
    console.warn('[PWA] Error al disparar prompt de instalación:', err);
  }

  return false;
}

export function registerServiceWorker() {
  if (typeof window === 'undefined') return;

  // 1. Detectar si ya se está ejecutando como PWA Standalone (pantalla completa sin barra de navegador)
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true;

  currentState.isStandalone = isStandalone;
  currentState.isInstalled = isStandalone;
  notifyListeners();

  // 2. Escuchar evento `beforeinstallprompt` de Android Chrome
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    // Prevenir el banner automático intrusivo para controlarlo en la interfaz DHARMA
    e.preventDefault();
    deferredInstallPrompt = e;
    currentState.isInstallable = true;
    notifyListeners();
    console.log('[PWA] Evento beforeinstallprompt capturado. DHARMA está listo para instalar en Android.');
  });

  // 3. Escuchar evento de instalación completada
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] DHARMA se ha instalado exitosamente en el dispositivo.');
    deferredInstallPrompt = null;
    currentState.isInstalled = true;
    currentState.isInstallable = false;
    notifyListeners();
  });

  // 4. Registrar Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registrado con éxito en scope:', registration.scope);
        })
        .catch((error) => {
          console.warn('[PWA] Falló el registro del Service Worker:', error);
        });
    });
  }
}
