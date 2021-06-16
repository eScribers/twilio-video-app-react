import React from 'react';
import AudioLevelIndicator from '../../../AudioLevelIndicator/AudioLevelIndicator';
import { LocalAudioTrack } from 'twilio-video';
import { FormControl, MenuItem, Typography, Select, Grid } from '@material-ui/core';
import { SELECTED_AUDIO_INPUT_KEY } from '../../../../constants';
import useMediaStreamTrack from '../../../../hooks/useMediaStreamTrack/useMediaStreamTrack';
import { TRACK_TYPE } from '../../../../utils/displayStrings';
import { observer } from 'mobx-react-lite';
import rootStore from '../../../../stores';

const AudioInputList = observer(() => {
  const { participantStore } = rootStore;
  const { devices } = participantStore;

  const localAudioTrack = participantStore.localTracks.find(
    track => track?.kind === TRACK_TYPE.AUDIO
  ) as LocalAudioTrack;
  const mediaStreamTrack = useMediaStreamTrack(localAudioTrack);
  const localAudioInputDeviceId = mediaStreamTrack?.getSettings().deviceId;

  function replaceTrack(newDeviceId: string) {
    window.localStorage.setItem(SELECTED_AUDIO_INPUT_KEY, newDeviceId);
    localAudioTrack?.restart({ deviceId: { exact: newDeviceId } });
  }

  return (
    <div>
      <Typography variant="subtitle2" gutterBottom>
        Audio Input
      </Typography>
      <Grid container alignItems="center" justify="center">
        <div className="inputSelect">
          {devices.audioInputDevices.length > 1 ? (
            <FormControl fullWidth>
              <Select
                onChange={e => replaceTrack(e.target.value as string)}
                value={localAudioInputDeviceId || ''}
                variant="outlined"
              >
                {devices.audioInputDevices.map(device => (
                  <MenuItem value={device.deviceId} key={device.deviceId}>
                    {device.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Typography>{localAudioTrack?.mediaStreamTrack.label || 'No Local Audio'}</Typography>
          )}
        </div>
        <AudioLevelIndicator audioTrack={localAudioTrack} background="white" />
      </Grid>
    </div>
  );
});

export default AudioInputList;
