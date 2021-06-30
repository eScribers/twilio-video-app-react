import React, { useState } from 'react';
import { DEFAULT_VIDEO_CONSTRAINTS, SELECTED_VIDEO_INPUT_KEY } from '../../../../constants';
import { FormControl, MenuItem, Typography, Select } from '@material-ui/core';
import { LocalVideoTrack } from 'twilio-video';
import { makeStyles } from '@material-ui/core/styles';
import VideoTrack from '../../../VideoTrack/VideoTrack';
import useMediaStreamTrack from '../../../../hooks/useMediaStreamTrack/useMediaStreamTrack';
import { observer } from 'mobx-react-lite';
import rootStore from '../../../../stores';

const useStyles = makeStyles({
  preview: {
    width: '300px',
    maxHeight: '200px',
    margin: '0.5em auto',
    '& video': {
      maxHeight: '200px',
    },
  },
});

const VideoInputList = observer(() => {
  const classes = useStyles();
  const { participantsStore } = rootStore;

  const localVideoTrack = participantsStore.localTracks.find(track => track?.kind === 'video') as
    | LocalVideoTrack
    | undefined;
  const mediaStreamTrack = useMediaStreamTrack(localVideoTrack);
  const [storedLocalVideoDeviceId, setStoredLocalVideoDeviceId] = useState(
    window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY)
  );
  const localVideoInputDeviceId = mediaStreamTrack?.getSettings().deviceId || storedLocalVideoDeviceId;

  function replaceTrack(newDeviceId: string) {
    // Here we store the device ID in the component state. This is so we can re-render this component display
    // to display the name of the selected device when it is changed while the users camera is off.
    setStoredLocalVideoDeviceId(newDeviceId);
    window.localStorage.setItem(SELECTED_VIDEO_INPUT_KEY, newDeviceId);
    localVideoTrack?.restart({
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      deviceId: { exact: newDeviceId },
    });
  }

  return (
    <div>
      {localVideoTrack && (
        <div className={classes.preview}>
          <VideoTrack isLocal track={localVideoTrack} />
        </div>
      )}
      {participantsStore.devices.videoInputDevices.length > 1 ? (
        <FormControl fullWidth>
          <Typography variant="subtitle2" gutterBottom>
            Video Input
          </Typography>
          <Select
            onChange={e => replaceTrack(e.target.value as string)}
            value={localVideoInputDeviceId || ''}
            variant="outlined"
          >
            {participantsStore.devices.videoInputDevices.map(device => (
              <MenuItem value={device.deviceId} key={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Video Input
          </Typography>
          <Typography>{localVideoTrack?.mediaStreamTrack.label || 'No Local Video'}</Typography>
        </>
      )}
    </div>
  );
});

export default VideoInputList;
