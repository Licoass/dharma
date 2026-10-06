import { useState, useEffect } from 'react';
import { 
  subscribePwaInstall, 
  promptPwaInstall, 
  type PwaInstallState 
} from '../registerServiceWorker';

export function usePwaInstall() {
  const [installState, setInstallState] = useState<PwaInstallState>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
  });

  useEffect(() => {
    return subscribePwaInstall((state) => {
      setInstallState(state);
    });
  }, []);

  return {
    ...installState,
    installPwa: promptPwaInstall,
  };
}
