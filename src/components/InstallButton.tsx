import { IconButton, ButtonGroup } from 'rsuite';
import { MoveDown } from '@rsuite/icons';
import { usePWA } from '../context/PWAContext';

export function InstallButton() {
  const { showInstallBtn, handleInstall } = usePWA();

  if (!showInstallBtn) return null;

  return (
      <ButtonGroup justified>
        <IconButton
          className={'closeBtn'}
          icon={<MoveDown />}
          onClick={handleInstall}
        >
          Install App
        </IconButton>
      </ButtonGroup>
  );
}