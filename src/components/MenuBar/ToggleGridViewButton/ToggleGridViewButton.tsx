import React from 'react';
import GridOnIcon from '@material-ui/icons/GridOn';
import IconButton from '@material-ui/core/IconButton';
import { ViewModeArray, Settings } from '../../../state/settings/settingsReducer';
import { useAppState } from '../../../state';

export default function ToggleGridViewButton() {
  const { settings, dispatchSetting } = useAppState();
  const handleChange = () => {
    const indexOfCurrMode = ViewModeArray.indexOf(settings.viewMode);
    const indexOfNextMode = indexOfCurrMode + 1 < ViewModeArray.length ? indexOfCurrMode + 1 : 0;
    const nextView = ViewModeArray[indexOfNextMode];
    dispatchSetting({
      name: 'viewMode' as keyof Settings,
      value: nextView,
    });
  };

  return (
    <IconButton onClick={handleChange}>
      <GridOnIcon />
    </IconButton>
  );
}
