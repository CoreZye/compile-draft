import { IconButton } from 'rsuite';
import { MoveDown } from '@rsuite/icons';
import { usePWA } from '../context/PWAContext';

export function InstallButton() {
  const { showInstallBtn, handleInstall } = usePWA();

  if (!showInstallBtn) return null;

  return (
    <IconButton 
      appearance="primary" 
      color="cyan" 
      icon={<MoveDown />} 
      onClick={handleInstall}
    >
      Install App
    </IconButton>
  );
}