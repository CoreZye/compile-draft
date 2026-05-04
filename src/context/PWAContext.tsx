import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface PWAContextType {
  installPrompt: any;
  showInstallBtn: boolean;
  handleInstall: () => Promise<void>;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export function PWAProvider({ children }: { children: ReactNode }) {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
      setShowInstallBtn(false);
    }
  };

  return (
    <PWAContext.Provider value={{ installPrompt, showInstallBtn, handleInstall }}>
      {children}
    </PWAContext.Provider>
  );
}

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) throw new Error('usePWA must be used within PWAProvider');
  return context;
};