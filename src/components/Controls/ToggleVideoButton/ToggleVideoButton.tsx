import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Videocam from '@material-ui/icons/Videocam';
import VideocamOff from '@material-ui/icons/VideocamOff';

import useLocalVideoToggle from '../../../hooks/useLocalVideoToggle/useLocalVideoToggle';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  })
);
export default function ToggleVideoButton(props: { disabled?: boolean }) {
  const classes = useStyles();
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const [, setDisabled] = useState(false);
  const {
    room: { localParticipant },
  } = useVideoContext();
  function handleVideoTrackPublishUnpublishInProgress(inProgress: any) {
    setDisabled(inProgress);
  }
  useEffect(() => {
    if (localParticipant) {
      localParticipant.on('videoTrackPublishUnpublishInProgress', handleVideoTrackPublishUnpublishInProgress);
    }
    return () => {
      if (localParticipant) {
        localParticipant.off('videoTrackPublishUnpublishInProgress', handleVideoTrackPublishUnpublishInProgress);
      }
    };
  }, [localParticipant]);

  return (
    <Tooltip title={isVideoEnabled ? 'Video off' : 'Video on'} placement="top" PopperProps={{ disablePortal: true }}>
      <Fab
        className={classes.fab}
        onClick={() => {
          // if (localParticipant && !isVideoEnabled) {
          //   setDisabled(true);
          // }
          toggleVideoEnabled();
        }}
        disabled={props.disabled}
      >
        {isVideoEnabled ? <Videocam /> : <VideocamOff />}
      </Fab>
    </Tooltip>
  );
}
