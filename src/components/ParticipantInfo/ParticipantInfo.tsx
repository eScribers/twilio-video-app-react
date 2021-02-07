import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles } from '@material-ui/core/styles';
// import ScreenShare from '@material-ui/icons/ScreenShare';
import VideocamOff from '@material-ui/icons/VideocamOff';
import AudioLevelIndicator from '../AudioLevelIndicator/AudioLevelIndicator';
import BandwidthWarning from '../BandwidthWarning/BandwidthWarning';
import NetworkQualityLevel from '../MenuBar/NewtorkQualityLevel/NetworkQualityLevel';
import PinIcon from './PinIcon/PinIcon';
import ParticipantDropDown from './ParticipantDropDown/ParticipantDropDown';
import useParticipantNetworkQualityLevel from '../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';
import usePublications from '../../hooks/usePublications/usePublications';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import useTrack from '../../hooks/useTrack/useTrack';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { TRACK_TYPE } from '../../utils/displayStrings';
import { ParticipantIdentity } from '../../utils/participantIdentity';
import ParticipantNameTag from './ParticipantNameTag/ParticipantNameTag';

export default function ParticipantInfo({ participant, onClick, isSelected, children }) {
  const useStyles = makeStyles(theme =>
    createStyles({
      container: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        cursor: 'pointer',
        '& video': {
          filter: 'none',
        },
        '& svg': {
          stroke: 'black',
          strokeWidth: '0.8px',
        },
        height: `${(theme.sidebarWidth * 9) / 16}px`,
        [theme.breakpoints.down('xs')]: {
          height: theme.sidebarMobileHeight,
          width: `${(theme.sidebarMobileHeight * 16) / 9}px`,
          marginRight: '3px',
          fontSize: '10px',
        },
      },
      isVideoSwitchedOff: {
        '& video': {
          filter: 'blur(4px) grayscale(1) brightness(0.5)',
        },
      },
      infoContainer: {
        position: 'absolute',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        padding: '0.4em',
        width: '100%',
        background: 'transparent',
      },
      hideVideo: {
        background: 'black',
      },
      infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
      },
    })
  );

  const publications = usePublications(participant);

  const audioPublication = publications.find(p => p.kind === TRACK_TYPE.AUDIO);
  const videoPublication = publications.find(p => p.kind === TRACK_TYPE.VIDEO);

  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);
  const isVideoEnabled = Boolean(videoPublication);
  // const isScreenShareEnabled = publications.find(p => p.trackName === TRACK_TYPE.SCREEN);

  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack);

  const audioTrack: any = useTrack(audioPublication);

  const classes = useStyles();
  const {
    room: { localParticipant },
  } = useVideoContext();
  const localParticipantType: string = ParticipantIdentity.Parse(localParticipant.identity).partyType;

  return (
    <div
      className={clsx(classes.container, {
        [classes.isVideoSwitchedOff]: isVideoSwitchedOff,
      })}
      onClick={onClick}
      data-cy-participant={participant.identity}
    >
      <div
        className={clsx(classes.infoContainer, {
          [classes.hideVideo]: !isVideoEnabled,
        })}
      >
        <div className={classes.infoRow}>
          <ParticipantNameTag participant={participant} />
          <NetworkQualityLevel qualityLevel={networkQualityLevel} />
        </div>
        <div>
          <AudioLevelIndicator audioTrack={audioTrack} background="white" />
          {!isVideoEnabled && <VideocamOff />}
          {isSelected && <PinIcon />}
          <ParticipantDropDown participant={participant} localParticipantType={localParticipantType} />
        </div>
      </div>
      {isVideoSwitchedOff && <BandwidthWarning />}
      {children}
    </div>
  );
}
