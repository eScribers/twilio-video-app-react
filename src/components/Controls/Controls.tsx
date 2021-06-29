import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import rootStore from '../../stores';
import ToggleScreenShareButton from './ToogleScreenShareButton/ToggleScreenShareButton';
import EndCallButton from './EndCallButton/EndCallButton';
import ToggleAudioButton from './ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from './ToggleVideoButton/ToggleVideoButton';
import { ROOM_STATE } from '../../utils/displayStrings';
import useIsUserActive from './useIsUserActive/useIsUserActive';
import { observer } from 'mobx-react-lite';
import { PARTICIPANT_TYPES } from '../../utils/rbac/ParticipantTypes';
import { ParticipantIdentity } from '../../utils/participantIdentity';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      position: 'absolute',
      right: '50%',
      transform: 'translate(50%, 30px)',
      bottom: '50px',
      zIndex: 1,
      transition: 'opacity 1.2s, transform 1.2s, visibility 0s 1.2s',
      opacity: 0,
      visibility: 'hidden',
      maxWidth: 'min-content',
      '&.showControls, &:hover': {
        transition: 'opacity 0.6s, transform 0.6s, visibility 0s',
        opacity: 1,
        zIndex: 2,
        visibility: 'visible',
        transform: 'translate(50%, 0px)',
      },
      [theme.breakpoints.down('xs')]: {
        bottom: `${theme.sidebarMobileHeight + 3}px`,
      },
    },
  })
);

const Controls = observer(() => {
  const classes = useStyles();
  const { roomsStore, participantsStore } = rootStore;
  const partyType = !participantsStore.participant
    ? ''
    : ParticipantIdentity.Parse(participantsStore.participant.identity).partyType;
  const isReconnecting = roomsStore.roomState === ROOM_STATE.RECONNECTING;
  const isdisconnected = roomsStore.roomState === ROOM_STATE.DISCONNECTED;
  const isUserActive = useIsUserActive();
  const showControls = isUserActive || roomsStore.roomState === ROOM_STATE.DISCONNECTED;
  const canToggleMute = [PARTICIPANT_TYPES.HEARING_OFFICER].includes(partyType) || participantsStore.isReporterIn;
  const disableButtons = isReconnecting ? isReconnecting : isdisconnected ? false : !canToggleMute;

  return (
    <div className={clsx(classes.container, { showControls })}>
      <ToggleAudioButton disabled={disableButtons} />
      <ToggleVideoButton disabled={isReconnecting} />
      {roomsStore.roomState !== ROOM_STATE.DISCONNECTED && (
        <>
          <ToggleScreenShareButton disabled={isReconnecting} />
          <EndCallButton />
        </>
      )}
    </div>
  );
});

export default Controls;
