import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Videocam from '@material-ui/icons/Videocam';
import VideocamOff from '@material-ui/icons/VideocamOff';

import { observer } from 'mobx-react-lite';
import rootStore from '../../../stores';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  })
);
const ToggleVideoButton = observer((props: { disabled?: boolean }) => {
  const classes = useStyles();
  const { participantsStore } = rootStore;
  const localParticipant = participantsStore.localParticipant?.participant;
  const [, setDisabled] = useState(false);
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
    <Tooltip
      title={participantsStore.localVideoTrack ? 'Video off' : 'Video on'}
      placement="top"
      PopperProps={{ disablePortal: true }}
    >
      <Fab
        className={classes.fab}
        onClick={() => {
          participantsStore.toggleVideoEnabled();
        }}
        disabled={props.disabled}
      >
        {participantsStore.localVideoTrack ? <Videocam /> : <VideocamOff />}
      </Fab>
    </Tooltip>
  );
});

export default ToggleVideoButton;
