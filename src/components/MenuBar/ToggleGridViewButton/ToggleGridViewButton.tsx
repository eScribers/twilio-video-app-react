import React, { useEffect, useState } from 'react';
import useWindowSize from '../../../hooks/useWindowSize/useWindowSize';
import GridOnIcon from '@material-ui/icons/GridOn';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { observer } from 'mobx-react-lite';
import rootStore from '../../../stores/rootStore';
import { Settings, VIEW_MODE } from '../../../types/settings';

const ViewModeArray = Object.values(VIEW_MODE);

const ToggleGridViewButton = () => {
  const { roomsStore } = rootStore;
  const { settings } = roomsStore;
  const [forceCollaboration, setForceCollaboration] = useState(false);
  const { width } = useWindowSize();

  const handleChange = () => {
    const indexOfCurrMode = ViewModeArray.indexOf(settings.viewMode);
    const indexOfNextMode = indexOfCurrMode + 1 < ViewModeArray.length ? indexOfCurrMode + 1 : 0;
    const nextView = ViewModeArray[indexOfNextMode];
    roomsStore.setSetting('viewMode' as keyof Settings, nextView);
  };

  useEffect(() => {
    if (forceCollaboration === false) {
      if (width && width < 768) {
        setForceCollaboration(true);
        roomsStore.setSetting('viewMode' as keyof Settings, 'collaboration');
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
};

export default observer(ToggleGridViewButton);
