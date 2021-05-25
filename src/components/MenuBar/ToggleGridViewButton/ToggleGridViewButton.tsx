import React, { useEffect, useState } from 'react';
import useWindowSize from '../../../hooks/useWindowSize/useWindowSize';
import GridOnIcon from '@material-ui/icons/GridOn';
import IconButton from '@material-ui/core/IconButton';
import { ViewModeArray, Settings } from '../../../state/settings/settingsReducer';
import Tooltip from '@material-ui/core/Tooltip';
import { useAppState } from '../../../hooks/useAppState/useAppState';

export default function ToggleGridViewButton() {
  const { settings, dispatchSetting } = useAppState();
  const [forceCollaboration, setForceCollaboration] = useState(false);
  const { width } = useWindowSize();

  const handleChange = () => {
    const indexOfCurrMode = ViewModeArray.indexOf(settings.viewMode);
    const indexOfNextMode = indexOfCurrMode + 1 < ViewModeArray.length ? indexOfCurrMode + 1 : 0;
    const nextView = ViewModeArray[indexOfNextMode];
    dispatchSetting({
      name: 'viewMode' as keyof Settings,
      value: nextView,
    });
  };

  useEffect(() => {
    if (forceCollaboration === false) {
      if (width && width < 768) {
        setForceCollaboration(true);
        dispatchSetting({
          name: 'viewMode' as keyof Settings,
          value: 'collaboration',
        });
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
}
