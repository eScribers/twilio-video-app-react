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
import { TRACK_TYPE, NOTIFICATION_MESSAGE, ERROR_MESSAGE, ROOM_STATE } from '../../utils/displayStrings';
import { PARTICIPANT_TYPES } from '../../utils/rbac/ParticipantTypes';
import LocalAudioLevelIndicator from './LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import ToggleFullscreenButton from './ToggleFullScreenButton/ToggleFullScreenButton';
import ToggleGridViewButton from './ToggleGridViewButton/ToggleGridViewButton';
//import SettingsButton from './SettingsButton/SettingsButton';
import Menu from './Menu/Menu';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useIsHostIn from '../../hooks/useIsHostIn/useIsHostIn';
import usePublishDataTrack from '../../hooks/useDataTrackPublisher/useDataTrackPublisher';
import useDataTrackListener from '../../hooks/useDataTrackListener/useDataTrackListener';
import { useAppState } from '../../hooks/useAppState/useAppState';
import { ParticipantInformation } from '../../types/participantInformation';
import { TwilioError } from 'twilio-video';
// import { LogglyTracker } from 'react-native-loggly-jslogger';
import moment from 'moment';
import rootStore from '../../stores';
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
    floatingDebugInfo: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.2)',
      color: 'rgba(255,255,255,0.4)',
      fontSize: '10px',
    },
  })
);

const getPartyTypes = () => {
  return Object.values(PARTICIPANT_TYPES);
};

const FloatingDebugInfo = ({ time, subConferenceId, wrapperClass }) => (
  <div className={wrapperClass}>
    {time} - SC:{subConferenceId}
  </div>
);

export default function MenuBar() {
  const classes = useStyles();
  const [submitButtonValue, setSubmitButtonValue] = useState<any>(JOIN_ROOM_MESSAGE);
  const {
    setError,
    getToken,
    isFetching,
    authoriseParticipant,
    setNotification,
    isAutoRetryingToJoinRoom,
    setWaitingNotification,
    isConfigLoaded,
    // logger,
  } = useAppState();
  const { isConnecting, connect, localTracks } = useVideoContext();
  const { roomStore } = rootStore;

  const [participantInfo, setParticipantInfo] = useState<ParticipantInformation | null>(null);
  const [retryJoinRoomAttemptTimerId, setRetryJoinRoomAttemptTimerId] = useState<NodeJS.Timeout>(null as any);
  const RETRY_INTERVAL = 15000;

  const { isHostIn, isReporterIn } = useIsHostIn();
  const [isHostInState, setIsHostInState] = useState(isHostIn);
  const [isReporterInState, setIsReporterInState] = useState(isReporterIn);
  useDataTrackListener();
  usePublishDataTrack(participantInfo);

  if (isAutoRetryingToJoinRoom === false) {
    clearTimeout(retryJoinRoomAttemptTimerId);
  }

  async function joinRoom(participantInformation: ParticipantInformation | null) {
    if (participantInformation === null) return;

    var response = null as any;
    try {
      response = await getToken(participantInformation);
    } catch (err) {
      if (err.response) setError({ message: err.response.data } as TwilioError);
      else setError({ message: ERROR_MESSAGE.NETWORK_ERROR } as TwilioError);

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
        setNotification({ message: NOTIFICATION_MESSAGE.ROOM_NOT_FOUND });
      }
    } else {
      setWaitingNotification(null);
      await connect(response);

      setSubmitButtonValue(JOIN_ROOM_MESSAGE);
    }
  }

  useEffect(() => {
    // Authorise participant
    if (!isConfigLoaded) return;
    (async () => {
      if (participantInfo === null) {
        const participantInformation: ParticipantInformation = await authoriseParticipant();

        if (participantInformation && participantInformation.displayName !== '') {
          setParticipantInfo(participantInformation);
          /*logger.push({
              browserType: detectBrowser(),
              userAgent: navigator.userAgent,
              participantInformation: participantInformation,
            });*/
        }
      }
    })();
  }, [participantInfo, authoriseParticipant, isConfigLoaded]);

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    joinRoom(participantInfo);
  };

  const audioTrack = localTracks.find(x => x.kind === TRACK_TYPE.AUDIO);
  if (isHostIn !== isHostInState) {
    if (isHostIn) {
      setNotification({ message: NOTIFICATION_MESSAGE.REPORTER_HAS_JOINED });
    } else {
      audioTrack?.disable();
      setNotification({ message: NOTIFICATION_MESSAGE.WAITING_FOR_REPORTER });
    }
    setIsHostInState(isHostIn);
  }
  if (isReporterIn !== isReporterInState) {
    if (!isReporterIn && participantInfo?.partyType === PARTICIPANT_TYPES.HEARING_OFFICER)
      setNotification({ message: NOTIFICATION_MESSAGE.REPORTER_DROPPED_FROM_THE_CALL });
    setIsReporterInState(isReporterIn);
  }

  return (
    <AppBar className={classes.container} position="static">
      <Toolbar>
        <img src="/escribers-logo-transparent.png" height="64px" alt="eScribers" />
        {roomStore.roomState === ROOM_STATE.DISCONNECTED ? (
          <form className={classes.form} onSubmit={handleSubmit}>
            <FormControl className={classes.textField}>
              <InputLabel>Party Type</InputLabel>
              <Select
                data-cy="select"
                label="Party Type"
                value={participantInfo ? participantInfo.partyType : ''}
                margin="dense"
                placeholder="Party Type"
                disabled={true}
              >
                {getPartyTypes().map(type => (
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
              value={participantInfo ? participantInfo.displayName : ''}
              margin="dense"
              disabled={true}
            />

            <TextField
              autoComplete="off"
              id="case-number"
              label="Case Number"
              className={classes.textField}
              value={participantInfo ? participantInfo.caseReference : ''}
              margin="dense"
              disabled={true}
            />
            <Online>
              <Button
                className={classes.joinButton}
                type="submit"
                color="primary"
                variant="contained"
                disabled={isConnecting || !participantInfo || isFetching}
              >
                {submitButtonValue}
              </Button>
            </Online>
            <Offline>
              <Button className={classes.joinButton} color="primary" variant="contained" disabled={true}>
                Offline
              </Button>
            </Offline>
            {(isConnecting || isFetching) && <CircularProgress className={classes.loadingSpinner} />}
          </form>
        ) : (
          <h3 style={{ paddingLeft: '10px' }}>
            Case Reference: {participantInfo ? participantInfo.caseReference : ''}
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
        subConferenceId={participantInfo?.videoConferenceRoomName}
      />
    </AppBar>
  );
}
