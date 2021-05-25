import React from 'react';
import clsx from 'clsx';
import { LocalAudioTrack, LocalVideoTrack, Participant, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import usePublications from '../../hooks/usePublications/usePublications';
import useTrack from '../../hooks/useTrack/useTrack';
import { TRACK_TYPE } from '../../utils/displayStrings';
import { ParticipantIdentity } from '../../utils/participantIdentity';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import AudioLevelIndicator from '../../components/AudioLevelIndicator/AudioLevelIndicator';
import AvatarIcon from '../../icons/AvatarIcon';
import useParticipantIsReconnecting from '../../hooks/useParticipantIsReconnecting/useParticipantIsReconnecting';

const useStyles = makeStyles({
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gridArea: 'participantList',
  },
  isVideoSwitchedOff: {
    '& video': {
      filter: 'blur(4px) grayscale(1) brightness(0.5)',
    },
  },
  identity: {
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '0.1em 0.3em',
    margin: '1em',
    fontSize: '1.2em',
    display: 'inline-flex',
    '& svg': {
      marginLeft: '0.3em',
    },
  },
  infoContainer: {
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    padding: '0.4em',
    width: '100%',
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
    '& svg': {
      transform: 'scale(2)',
    },
  },
});

interface MainParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
}

export default function MainParticipantInfo({ participant, children }: MainParticipantInfoProps) {
  const classes = useStyles();
  const {
    room: { localParticipant },
  } = useVideoContext();
  const isLocal = localParticipant === participant;

  const publications = usePublications(participant);
  const videoPublication = publications.find(p => p.trackName.includes(TRACK_TYPE.CAMERA));
  const screenSharePublication = publications.find(p => p.trackName.includes(TRACK_TYPE.SCREEN));

  const videoTrack = useTrack(screenSharePublication || videoPublication);
  const isVideoEnabled = Boolean(videoTrack);

  const audioPublication = publications.find(p => p.kind === TRACK_TYPE.AUDIO);
  const audioTrack = useTrack(audioPublication) as LocalAudioTrack | RemoteAudioTrack | undefined;

  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);
  const parsedIdentity = ParticipantIdentity.Parse(participant.identity);
  const isParticipantReconnecting = useParticipantIsReconnecting(participant);

  return (
    <div
      data-cy-main-participant
      data-cy-participant={participant.identity}
      className={clsx(classes.container, { [classes.isVideoSwitchedOff]: isVideoSwitchedOff })}
    >
      <div className={classes.infoContainer}>
        <AudioLevelIndicator audioTrack={audioTrack} />
        <h4 className={classes.identity}>
          {parsedIdentity.partyType} {parsedIdentity.isRegisteredUser ? '*' : null}
          {isLocal && '(You)'}
          {screenSharePublication && '- Screen'}
        </h4>
      </div>
      {(!isVideoEnabled || isVideoSwitchedOff) && (
        <div className={classes.avatarContainer}>
          <AvatarIcon />
        </div>
      )}
      {isParticipantReconnecting && (
        <div className={classes.reconnectingContainer}>
          <Typography variant="body1" style={{ color: 'white' }}>
            Reconnecting...
          </Typography>
        </div>
      )}
      {children}
    </div>
  );
}
