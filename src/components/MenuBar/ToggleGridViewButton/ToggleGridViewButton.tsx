import React, { useEffect, useState } from 'react';
import useWindowSize from '../../../hooks/useWindowSize/useWindowSize';
import GridOnIcon from '@material-ui/icons/GridOn';
import IconButton from '@material-ui/core/IconButton';
import { ViewModeArray, Settings } from '../../../state/settings/settingsReducer';
import Tooltip from '@material-ui/core/Tooltip';
import { observer } from 'mobx-react-lite';
import rootStore from '../../../stores';

const ToggleGridViewButton = observer(() => {
  const { roomStore } = rootStore;
  const { settings } = roomStore;
  const [forceCollaboration, setForceCollaboration] = useState(false);
  const { width } = useWindowSize();

  const handleChange = () => {
    const indexOfCurrMode = ViewModeArray.indexOf(settings.viewMode);
    const indexOfNextMode = indexOfCurrMode + 1 < ViewModeArray.length ? indexOfCurrMode + 1 : 0;
    const nextView = ViewModeArray[indexOfNextMode];
    roomStore.setSetting('viewMode' as keyof Settings, nextView);
  };

  useEffect(() => {
    if (forceCollaboration === false) {
      if (width && width < 768) {
        setForceCollaboration(true);
        roomStore.setSetting('viewMode' as keyof Settings, 'collaboration');
      }
    }
    if (forceCollaboration === true) {
      if (width && width >= 768) setForceCollaboration(false);
    }
    // eslint-disable-next-line
  }, [width, forceCollaboration]);

  return forceCollaboration ? null : (
    <Tooltip title={settings.viewMode} aria-label="add">
      <IconButton onClick={handleChange}>
        <GridOnIcon />
      </IconButton>
    </Tooltip>
  );
});

export default ToggleGridViewButton;
