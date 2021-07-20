import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Mic from '@material-ui/icons/Mic';
import MicOff from '@material-ui/icons/MicOff';
import Tooltip from '@material-ui/core/Tooltip';
import { observer } from 'mobx-react-lite';
import rootStore from '../../../stores/rootStore';
import useIsTrackEnabled from '../../../hooks/useIsTrackEnabled/useIsTrackEnabled';
import { LocalAudioTrack, RemoteAudioTrack } from 'twilio-video';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  })
);

const ToggleAudioButton = observer((props: { disabled?: boolean }) => {
  const classes = useStyles();
  const { participantsStore } = rootStore;

  const isAudioEnabled = useIsTrackEnabled(participantsStore.localAudioTrack as LocalAudioTrack | RemoteAudioTrack);

  return (
    <Tooltip title={isAudioEnabled ? 'Mute' : 'Unmute'} placement="top" PopperProps={{ disablePortal: true }}>
      <span>
        <Fab
          className={classes.fab}
          onClick={() => participantsStore.toggleAudioEnabled()}
          disabled={props.disabled}
          data-cy-audio-toggle
        >
          {isAudioEnabled ? <Mic /> : <MicOff />}
        </Fab>
      </span>
    </Tooltip>
  );
});

export default ToggleAudioButton;
