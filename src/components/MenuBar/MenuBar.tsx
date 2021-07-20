import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { Offline, Online } from 'react-detect-offline';
import { NOTIFICATION_MESSAGE, ERROR_MESSAGE, ROOM_STATE } from '../../utils/displayStrings';
import { PARTICIPANT_TYPES as PARTICIPANT_ROLES } from '../../utils/rbac/ParticipantTypes';
import LocalAudioLevelIndicator from './LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import ToggleFullscreenButton from './ToggleFullScreenButton/ToggleFullScreenButton';
import ToggleGridViewButton from './ToggleGridViewButton/ToggleGridViewButton';
import Menu from './Menu/Menu';
import { ParticipantInformation } from '../../types/participantInformation';
import { TwilioError } from 'twilio-video';
import rootStore from '../../stores/rootStore';
import { observer } from 'mobx-react-lite';
import FloatingDebugInfo from './FloatingDebugInfo/FloatingDebugInfo';
const JOIN_ROOM_MESSAGE = 'Enter Hearing Room';
const RETRY_ROOM_MESSAGE = 'Retry Entering Hearing Room';
const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
    },
    rightButtonContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        marginLeft: '2.2em',
      },
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    loadingSpinner: {
      marginLeft: '1em',
    },
    displayName: {
      margin: '1.1em 0.6em',
      minWidth: '200px',
      fontWeight: 600,
    },
    joinButton: {
      margin: '1em',
    },
    dialInWrapper: {
      margin: '0 20px 0 20px',
    },
    dialIn: {
      margin: 0,
    },
  })
);

const MenuBar = () => {
  const classes = useStyles();
  const [submitButtonValue, setSubmitButtonValue] = useState<any>(JOIN_ROOM_MESSAGE);
  const { roomsStore, participantsStore } = rootStore;
  const { isConnecting, config, isAutoRetryingToJoinRoom } = roomsStore;
  const { isFetchingUserToken, participantInformation } = participantsStore;

  const [retryJoinRoomAttemptTimerId, setRetryJoinRoomAttemptTimerId] = useState<NodeJS.Timeout>(null as any);
  const RETRY_INTERVAL = 15000;

  const [isReporterInState, setIsReporterInState] = useState(participantsStore.isReporterIn);

  if (isAutoRetryingToJoinRoom === false) {
    clearTimeout(retryJoinRoomAttemptTimerId);
  }

  async function joinRoom(participantInformation: ParticipantInformation | null) {
    if (participantInformation === null) return;

    var response = null as any;
    try {
      response = await participantsStore.getParticipantConferenceToken(participantInformation);
    } catch (err) {
      if (err.response) roomsStore.setError({ message: err.response.data } as TwilioError);
      else roomsStore.setError({ message: ERROR_MESSAGE.NETWORK_ERROR } as TwilioError);

      setSubmitButtonValue(JOIN_ROOM_MESSAGE);
      return;
    }

    if (response === NOTIFICATION_MESSAGE.ROOM_NOT_FOUND) {
      setSubmitButtonValue(RETRY_ROOM_MESSAGE);
      if (isAutoRetryingToJoinRoom) {
        roomsStore.setWaitingNotification(NOTIFICATION_MESSAGE.AUTO_RETRYING_TO_JOIN_ROOM);
        var timeoutObj: NodeJS.Timeout = setTimeout(() => {
          joinRoom(participantInformation);
        }, RETRY_INTERVAL);
        setRetryJoinRoomAttemptTimerId(timeoutObj);
      } else {
        roomsStore.setNotification({ message: NOTIFICATION_MESSAGE.ROOM_NOT_FOUND });
      }
    } else {
      roomsStore.setWaitingNotification(null);
      await roomsStore.joinRoom(response);

      setSubmitButtonValue(JOIN_ROOM_MESSAGE);
    }
  }

  useEffect(() => {
    if (config.loaded) {
      participantsStore.authoriseParticipant();
    }
  }, [participantsStore, config]);

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    joinRoom(participantInformation);
  };

  const isReporterIn = participantsStore.isReporterIn;

  useEffect(() => {
    if (!participantInformation?.role) {
      return;
    }
    if (isReporterIn === isReporterInState || roomsStore.currentRoomState !== ROOM_STATE.CONNECTED) return;

    if (![PARTICIPANT_ROLES.HEARING_OFFICER, PARTICIPANT_ROLES.REPORTER].includes(participantInformation.role)) {
      if (isReporterIn) {
        roomsStore.setNotification({ message: NOTIFICATION_MESSAGE.REPORTER_HAS_JOINED });
      } else {
        participantsStore.setLocalAudioTrackEnabled(false);
        roomsStore.setNotification({ message: NOTIFICATION_MESSAGE.WAITING_FOR_REPORTER });
      }
    }

    if (participantInformation.role === PARTICIPANT_ROLES.HEARING_OFFICER) {
      if (!isReporterIn) roomsStore.setNotification({ message: NOTIFICATION_MESSAGE.REPORTER_DROPPED_FROM_THE_CALL });
    }
    setIsReporterInState(isReporterIn);
  }, [participantInformation, participantsStore, isReporterIn, isReporterInState, roomsStore]);

  return (
    <AppBar className={classes.container} position="static">
      <Toolbar>
        <img src="/escribers-logo-transparent.png" height="64px" alt="eScribers" />
        {roomsStore.currentRoomState === ROOM_STATE.DISCONNECTED ? (
          <form className={classes.form} onSubmit={handleSubmit}>
            <FormControl className={classes.textField}>
              <InputLabel>Party Type</InputLabel>
              <Select
                data-cy="select"
                label="Role"
                value={participantInformation ? participantInformation.role : ''}
                margin="dense"
                placeholder="Role"
                disabled={true}
              >
                {Object.values(PARTICIPANT_ROLES).map(type => (
                  <MenuItem key={type} value={type} data-cy="menu-item">
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              autoComplete="off"
              id="party-name"
              label="Party Name"
              className={classes.textField}
              value={participantInformation ? participantInformation.displayName : ''}
              margin="dense"
              disabled={true}
            />
            <TextField
              autoComplete="off"
              id="case-number"
              label="Case Number"
              className={classes.textField}
              value={participantInformation ? participantInformation.caseReference : ''}
              margin="dense"
              disabled={true}
            />
            <Online>
              <Button
                className={classes.joinButton}
                type="submit"
                color="primary"
                variant="contained"
                disabled={isConnecting || !participantInformation || isFetchingUserToken}
              >
                {submitButtonValue}
              </Button>
            </Online>
            <Offline>
              <Button className={classes.joinButton} color="primary" variant="contained" disabled={true}>
                Offline
              </Button>
            </Offline>
            {(isConnecting || isFetchingUserToken) && <CircularProgress className={classes.loadingSpinner} />}
          </form>
        ) : (
          <h3 style={{ paddingLeft: '10px' }}>
            Case Reference: {participantInformation ? participantInformation.caseReference : ''}
          </h3>
        )}
        <div className={classes.rightButtonContainer}>
          <div className={classes.dialInWrapper}>
            <h3 className={classes.dialIn}>Dial in number</h3>
            <span>+1 929 297 8424</span>
          </div>
          <ToggleGridViewButton />
          <LocalAudioLevelIndicator />
          <ToggleFullscreenButton />
          <Menu />
        </div>
      </Toolbar>
      <FloatingDebugInfo />
    </AppBar>
  );
};

export default observer(MenuBar);
