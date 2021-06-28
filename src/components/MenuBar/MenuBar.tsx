import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Toolbar from '@material-ui/core/Toolbar';
import { Offline, Online } from 'react-detect-offline';
import { NOTIFICATION_MESSAGE, ERROR_MESSAGE, ROOM_STATE } from '../../utils/displayStrings';
import { PARTICIPANT_TYPES } from '../../utils/rbac/ParticipantTypes';
import LocalAudioLevelIndicator from './LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import ToggleFullscreenButton from './ToggleFullScreenButton/ToggleFullScreenButton';
import ToggleGridViewButton from './ToggleGridViewButton/ToggleGridViewButton';
import Menu from './Menu/Menu';
import useDataTrackListener from '../../hooks/useDataTrackListener/useDataTrackListener';
import { useAppState } from '../../hooks/useAppState/useAppState';
import { ParticipantInformation } from '../../types/participantInformation';
import { TwilioError } from 'twilio-video';
import moment from 'moment';
import rootStore from '../../stores';
import { observer } from 'mobx-react-lite';
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
      margin: '1em 1.5em',
    },
    dialInWrapper: {
      margin: '0 20px 0 20px',
    },
    dialIn: {
      margin: 0,
    },
    floatingDebugInfo: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.2)',
      color: 'rgba(255,255,255,0.4)',
      fontSize: '10px',
    },
    identification: {
      display: 'flex',
      flexDirection: 'column',
      padding: '0 20px',
    },
    nameRoleRow: {
      display: 'flex',
    },
  })
);

const FloatingDebugInfo = ({ time, subConferenceId, wrapperClass }) => (
  <div className={wrapperClass}>
    {time} - SC:{subConferenceId}
  </div>
);

const MenuBar = observer(() => {
  const classes = useStyles();
  const [submitButtonValue, setSubmitButtonValue] = useState<any>(JOIN_ROOM_MESSAGE);
  const {
    isAutoRetryingToJoinRoom,
    setWaitingNotification,
    // logger,
  } = useAppState();
  const { roomStore, participantStore } = rootStore;
  const { isConnecting, config } = roomStore;
  const { isFetchingUserToken, participantInformation } = participantStore;

  const [retryJoinRoomAttemptTimerId, setRetryJoinRoomAttemptTimerId] = useState<NodeJS.Timeout>(null as any);
  const RETRY_INTERVAL = 15000;

  const [isReporterInState, setIsReporterInState] = useState(participantStore.isReporterIn);
  useDataTrackListener();

  if (isAutoRetryingToJoinRoom === false) {
    clearTimeout(retryJoinRoomAttemptTimerId);
  }

  async function joinRoom(participantInformation: ParticipantInformation | null) {
    if (participantInformation === null) return;

    var response = null as any;
    try {
      response = await participantStore.getToken(participantInformation);
    } catch (err) {
      if (err.response) roomStore.setError({ message: err.response.data } as TwilioError);
      else roomStore.setError({ message: ERROR_MESSAGE.NETWORK_ERROR } as TwilioError);

      setSubmitButtonValue(JOIN_ROOM_MESSAGE);
      return;
    }

    if (response === NOTIFICATION_MESSAGE.ROOM_NOT_FOUND) {
      setSubmitButtonValue(RETRY_ROOM_MESSAGE);
      if (isAutoRetryingToJoinRoom) {
        setWaitingNotification(NOTIFICATION_MESSAGE.AUTO_RETRYING_TO_JOIN_ROOM);
        var timeoutObj: NodeJS.Timeout = setTimeout(() => {
          joinRoom(participantInformation);
        }, RETRY_INTERVAL);
        setRetryJoinRoomAttemptTimerId(timeoutObj);
      } else {
        roomStore.setNotification({ message: NOTIFICATION_MESSAGE.ROOM_NOT_FOUND });
      }
    } else {
      setWaitingNotification(null);
      await roomStore.joinRoom(response);

      setSubmitButtonValue(JOIN_ROOM_MESSAGE);
    }
  }

  const configLoaded = config.loaded;
  useEffect(() => {
    if (configLoaded) {
      participantStore.authoriseParticipant();
    }
  }, [participantStore, configLoaded]);

  const handleSubmit = () => {
    joinRoom(participantInformation);
  };

  const isReporterIn = participantStore.isReporterIn;

  useEffect(() => {
    if (!participantInformation?.partyType) {
      return;
    }
    if (isReporterIn === isReporterInState) return;

    if (![PARTICIPANT_TYPES.HEARING_OFFICER, PARTICIPANT_TYPES.REPORTER].includes(participantInformation.partyType)) {
      if (isReporterIn) {
        roomStore.setNotification({ message: NOTIFICATION_MESSAGE.REPORTER_HAS_JOINED });
      } else {
        participantStore.setLocalAudioTrackEnabled(false);
        roomStore.setNotification({ message: NOTIFICATION_MESSAGE.WAITING_FOR_REPORTER });
      }
    }

    if (participantInformation.partyType === PARTICIPANT_TYPES.HEARING_OFFICER) {
      if (!isReporterIn) roomStore.setNotification({ message: NOTIFICATION_MESSAGE.REPORTER_DROPPED_FROM_THE_CALL });
    }
    setIsReporterInState(isReporterIn);
  }, [participantInformation, participantStore, isReporterIn, isReporterInState, roomStore]);

  return (
    <AppBar className={classes.container} position="static">
      <Toolbar>
        <img src="/escribers-logo-transparent.png" height="64px" alt="eScribers" />
        {roomStore.roomState === ROOM_STATE.DISCONNECTED ? (
          <>
            <Online>
              <Button
                className={classes.joinButton}
                type="submit"
                color="primary"
                variant="contained"
                onClick={handleSubmit}
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
            <div className={classes.identification}>
              <div className={classes.nameRoleRow}>
                {participantInformation ? participantInformation.displayName + ' - ' : ''}
                {participantInformation ? participantInformation.partyType : ''}
              </div>
              <div>{participantInformation ? 'Case number: ' + participantInformation.caseReference : ''}</div>
            </div>
            {(isConnecting || isFetchingUserToken) && <CircularProgress className={classes.loadingSpinner} />}
          </>
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
          {/* {!mobileAndTabletCheck() && (
            <SettingsButton selectedAudioDevice={selectedAudioDevice} selectedVideoDevice={selectedVideoDevice} />
          )} */}
          <LocalAudioLevelIndicator />
          <ToggleFullscreenButton />
          <Menu />
        </div>
      </Toolbar>
      <FloatingDebugInfo
        wrapperClass={classes.floatingDebugInfo}
        time={moment().format()}
        subConferenceId={participantInformation?.videoConferenceRoomName}
      />
    </AppBar>
  );
});

export default MenuBar;
