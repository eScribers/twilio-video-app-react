import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { LocalAudioTrack, LocalVideoTrack, Participant, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';
import AudioLevelIndicator from '../AudioLevelIndicator/AudioLevelIndicator';
import AvatarIcon from '../../icons/AvatarIcon';
import NetworkQualityLevel from '../NetworkQualityLevel/NetworkQualityLevel';
import PinIcon from './PinIcon/PinIcon';
import ScreenShareIcon from '../../icons/ScreenShareIcon';
import Typography from '@material-ui/core/Typography';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import usePublications from '../../hooks/usePublications/usePublications';
import useTrack from '../../hooks/useTrack/useTrack';
import useParticipantIsReconnecting from '../../hooks/useParticipantIsReconnecting/useParticipantIsReconnecting';
import { TRACK_TYPE } from '../../utils/displayStrings';
import { ParticipantIdentity } from '../../utils/participantIdentity';
import ParticipantDropDown from './ParticipantDropDown/ParticipantDropDown';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { ParticipantNameTag } from '../ParticipantNameTag/ParticipantNameTag';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: 0,
      overflow: 'hidden',
      '& video': {
        filter: 'none',
        objectFit: 'contain !important',
      },
      borderRadius: '4px',
      border: `${theme.participantBorderWidth}px solid rgb(245, 248, 255)`,
      paddingTop: `calc(${(9 / 16) * 100}% - ${theme.participantBorderWidth}px)`,
      background: 'black',
      marginBottom: '5px',
      [theme.breakpoints.down('sm')]: {
        height: theme.sidebarMobileHeight,
        width: `${(theme.sidebarMobileHeight * 16) / 9}px`,
        marginRight: '8px',
        marginBottom: '0',
        fontSize: '10px',
        paddingTop: `${theme.sidebarMobileHeight - 2}px`,
      },
    },
    innerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
    },
    infoContainer: {
      position: 'absolute',
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      width: '100%',
      background: 'transparent',
      top: 0,
    },
    avatarContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'black',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1,
      [theme.breakpoints.down('sm')]: {
        '& svg': {
          transform: 'scale(0.7)',
        },
      },
    },
    reconnectingContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(40, 42, 43, 0.75)',
      zIndex: 1,
    },
    screenShareIconContainer: {
      background: 'rgba(0, 0, 0, 0.5)',
      padding: '0.18em 0.3em',
      marginRight: '0.3em',
      display: 'flex',
      '& path': {
        fill: 'white',
      },
    },
    identity: {
      background: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      padding: '0.18em 0.3em',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      paddingRight: '20px',
    },
    infoRowBottom: {
      display: 'flex',
      justifyContent: 'space-between',
      position: 'absolute',
      bottom: 0,
      left: 0,
    },
    networkQualityContainer: {
      width: '28px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.5)',
    },
    typeography: {
      color: 'white',
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.75rem',
      },
    },
    hideParticipant: {
      display: 'none',
    },
    cursorPointer: {
      cursor: 'pointer',
    },
    dominantSpeaker: {
      outline: 'lime solid 2px',
    },
  })
);

interface ParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  isLocalParticipant?: boolean;
  hideParticipant?: boolean;
  isDominantSpeaker?: boolean;
}

export default function ParticipantInfo({
  participant,
  onClick,
  isSelected,
  children,
  // isLocalParticipant,
  hideParticipant,
  isDominantSpeaker,
}: ParticipantInfoProps) {
  const publications = usePublications(participant);
  const {
    room: { localParticipant },
  } = useVideoContext();

  const localParticipantType: string = !localParticipant
    ? ''
    : ParticipantIdentity.Parse(localParticipant.identity).partyType;

  const audioPublication = publications.find(p => p.kind === TRACK_TYPE.AUDIO);
  const videoPublication = publications.find(p => p.trackName.includes(TRACK_TYPE.CAMERA));

  const isVideoEnabled = Boolean(videoPublication);
  const isScreenShareEnabled = publications.find(p => p.trackName.includes(TRACK_TYPE.SCREEN));

  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);

  const audioTrack = useTrack(audioPublication) as LocalAudioTrack | RemoteAudioTrack | undefined;
  const isParticipantReconnecting = useParticipantIsReconnecting(participant);
  const [wasPinned, setWasPinned] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    // Pin this participant if he started sharing his screen
    if (isScreenShareEnabled && !wasPinned && !isSelected) {
      if (onClick) onClick();
      setWasPinned(true);
    }
    // Forget "wasPinned" when screen share is off
    if (!isScreenShareEnabled && wasPinned) {
      setWasPinned(false);
      if (isSelected) {
        if (onClick) onClick();
      }
    }
  }, [isScreenShareEnabled, isSelected, wasPinned, onClick]);

  return (
    <div
      className={clsx(classes.container, {
        [classes.hideParticipant]: hideParticipant,
        [classes.cursorPointer]: Boolean(onClick),
        [classes.dominantSpeaker]: isDominantSpeaker,
      })}
      onClick={onClick}
      data-cy-participant={participant.identity}
    >
      <div className={classes.infoContainer}>
        <div className={classes.networkQualityContainer}>
          <NetworkQualityLevel participant={participant} />
        </div>
        <div className={classes.infoRowBottom}>
          {isScreenShareEnabled && (
            <span className={classes.screenShareIconContainer}>
              <ScreenShareIcon />
            </span>
          )}
          <span className={classes.identity}>
            <AudioLevelIndicator audioTrack={audioTrack} participant={participant} />
            <ParticipantNameTag participant={participant} />
          </span>
        </div>
        <div>{isSelected && <PinIcon />}</div>
        <ParticipantDropDown participant={participant} localParticipantType={localParticipantType} />
      </div>
      <div className={classes.innerContainer}>
        {(!isVideoEnabled || isVideoSwitchedOff) && (
          <div className={classes.avatarContainer}>
            <AvatarIcon />
          </div>
        )}
        {isParticipantReconnecting && (
          <div className={classes.reconnectingContainer}>
            <Typography variant="body1" className={classes.typeography}>
              Reconnecting...
            </Typography>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
