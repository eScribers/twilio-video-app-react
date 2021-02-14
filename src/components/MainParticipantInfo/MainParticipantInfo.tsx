import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { LocalAudioTrack, LocalVideoTrack, Participant, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';

import BandwidthWarning from '../BandwidthWarning/BandwidthWarning';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import usePublications from '../../hooks/usePublications/usePublications';
import useTrack from '../../hooks/useTrack/useTrack';
import VideocamOff from '@material-ui/icons/VideocamOff';
import { TRACK_TYPE } from '../../utils/displayStrings';
import { ParticipantIdentity } from 'utils/participantIdentity';
import useVideoContext from 'hooks/useVideoContext/useVideoContext';
import AudioLevelIndicator from 'components/AudioLevelIndicator/AudioLevelIndicator';

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
  const screenSharePublication = publications.find(p => p.trackName.includes('screen'));
  const isVideoEnabled = Boolean(videoPublication);
  const audioPublication = publications.find(p => p.kind === 'audio');
  const audioTrack = useTrack(audioPublication) as LocalAudioTrack | RemoteAudioTrack | undefined;

  const videoTrack = useTrack(screenSharePublication || videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);
  const parsedIdentity = ParticipantIdentity.Parse(participant.identity);

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
          {isLocal && ' (You)'}
          {screenSharePublication && ' - Screen'}
          {!isVideoEnabled && <VideocamOff />}
        </h4>
      </div>
      {isVideoSwitchedOff && <BandwidthWarning />}
      {children}
    </div>
  );
}
