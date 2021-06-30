import React from 'react';
import { FormControl, MenuItem, Typography, Select } from '@material-ui/core';
import { useAppState } from '../../../../hooks/useAppState/useAppState';
import { observer } from 'mobx-react-lite';
import rootStore from '../../../../stores';

const AudioOutputList = () => {
  const { participantsStore } = rootStore;
  const { activeSinkId, setActiveSinkId } = useAppState();
  const activeOutputLabel = participantsStore.devices.audioOutputDevices.find(
    device => device.deviceId === activeSinkId
  )?.label;

  return (
    <div className="inputSelect">
      {participantsStore.devices.audioOutputDevices.length > 1 ? (
        <FormControl fullWidth>
          <Typography variant="subtitle2" gutterBottom>
            Audio Output
          </Typography>
          <Select onChange={e => setActiveSinkId(e.target.value as string)} value={activeSinkId} variant="outlined">
            {participantsStore.devices.audioOutputDevices.map(device => (
              <MenuItem value={device.deviceId} key={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          <Typography variant="subtitle2">Audio Output</Typography>
          <Typography>{activeOutputLabel || 'System Default Audio Output'}</Typography>
        </>
      )}
    </div>
  );
};

export default observer(AudioOutputList);
