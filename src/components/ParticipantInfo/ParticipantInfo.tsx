import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ScreenShare from '@material-ui/icons/ScreenShare';
import VideocamOff from '@material-ui/icons/VideocamOff';

import AudioLevelIndicator from '../AudioLevelIndicator/AudioLevelIndicator';
import BandwidthWarning from '../BandwidthWarning/BandwidthWarning';
import NetworkQualityLevel from '../MenuBar/NewtorkQualityLevel/NetworkQualityLevel';
import ParticipantConnectionIndicator from './ParticipantConnectionIndicator/ParticipantConnectionIndicator';
import PinIcon from './PinIcon/PinIcon';
import ParticipantDropDown from './ParticipantDropDown/ParticipantDropDown';

import useParticipantNetworkQualityLevel from '../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';
import usePublications from '../../hooks/usePublications/usePublications';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import useTrack from '../../hooks/useTrack/useTrack';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useHeight from '../../hooks/useHeight/useHeight';
import { TRACK_TYPE } from '../../utils/displayStrings';
import { PARTICIANT_TYPES } from '../../utils/participantTypes';
import { ParticipantIdentity } from '../../utils/participantIdentity';
export default function ParticipantInfo({ participant, onClick, isSelected, children, gridView }) {
  //const useStyles = gridView ? useStylesWithGridView : useStylesWithoutGridView;

  const publications = usePublications(participant);

  const audioPublication = publications.find(p => p.kind === TRACK_TYPE.AUDIO);
  const videoPublication = publications.find(p => p.kind === TRACK_TYPE.VIDEO); //publications.find(p => p.trackName.includes('camera'));//publications.find(p => p.kind === TRACK_TYPE.VIDEO);

  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);
  const isVideoEnabled = Boolean(videoPublication);
  const isScreenShareEnabled = publications.find(p => p.trackName === TRACK_TYPE.SCREEN);

  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack);

  const audioTrack: any = useTrack(audioPublication);

  const classes = useStyles();
  const {
    room: { localParticipant },
  } = useVideoContext();
  const localParticipantType = ParticipantIdentity.Parse(localParticipant.identity).partyType;
  const participantType = ParticipantIdentity.Parse(participant.identity).partyType;
  const enableParticipantDropDown =
    (localParticipantType === PARTICIANT_TYPES.REPORTER || localParticipantType === PARTICIANT_TYPES.HEARING_OFFICER) &&
    localParticipant.identity !== participant.identity &&
    !(localParticipantType === PARTICIANT_TYPES.HEARING_OFFICER && participantType === PARTICIANT_TYPES.REPORTER);

  const height = useHeight();
  const getHeight = () => {
    // get height in int
    let h = height.split('px')[0];
    let h1 = parseInt(h, 10);
    // adjust the height of menu bar 64px
    h1 -= 70;
    // adjust the bottom margin 70px
    h1 -= 70;
    // get height of one row
    h = (h1 / 3).toString();
    return `${h}px`;
  };
  var participantIdentity = ParticipantIdentity.Parse(participant.identity);
  return (
    <div
      className={clsx(classes.container, {
        [classes.isVideoSwitchedOff]: isVideoSwitchedOff,
      })}
      style={
        gridView
          ? {
              height: getHeight(),
            }
          : {}
      }
      onClick={onClick}
      data-cy-participant={participant.identity}
    >
      <div className={clsx(classes.infoContainer, { [classes.hideVideo]: !isVideoEnabled })}>
        <div className={classes.infoRow}>
          <h4 className={classes.identity}>
            <ParticipantConnectionIndicator participant={participant} />
            {participantIdentity.partyName} ({participantIdentity.partyType}
            {participantIdentity.isRegisteredUser ? '*' : ''})
          </h4>
          <NetworkQualityLevel qualityLevel={networkQualityLevel} />
        </div>
        <div>
          <AudioLevelIndicator audioTrack={audioTrack} background="white" />
          {!isVideoEnabled && <VideocamOff />}
          {isSelected && <PinIcon />}
          {enableParticipantDropDown && <ParticipantDropDown participant={participant} />}
        </div>
      </div>
      {isVideoSwitchedOff && <BandwidthWarning />}
      {children}
    </div>
  );
}
