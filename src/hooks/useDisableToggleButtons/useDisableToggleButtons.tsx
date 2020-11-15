import { Room } from 'twilio-video';
import { PARTICIANT_TYPES } from '../../utils/participantTypes';
import useVideoContext from '../useVideoContext/useVideoContext';
import useRoomState from '../useRoomState/useRoomState';
import { ROOM_STATE } from 'utils/displayStrings';
import { useEffect, useState } from 'react';
import { RemoteParticipant } from 'twilio-video';
import useIsHosetIn from '../useIsHosetIn/useIsHostIn';

export default function useDisbleToggleButtons() {
  const { room } = useVideoContext();
  const isHostIn = useIsHosetIn();
  const [disableToggleButtons, setDisbleToggleButtons] = useState(false);

  useEffect(() => {
    if (!isHostIn) {
      setDisbleToggleButtons(true);
      room.localParticipant.audioTracks.forEach(function(audioTrack) {
        audioTrack.track.disable();
      });
      room.localParticipant.videoTracks.forEach(function(videoTrack) {
        videoTrack.track.disable();
      });
      alert('waiting for reporter to join');
    }
  }, [room]);

  //return true;

  useEffect(() => {
    const participantConnected = (participant: RemoteParticipant) => {
      if (participant.identity.split('@')[1] === PARTICIANT_TYPES.REPORTER) {
        alert('Reporter has joind please unmute your microphon');
        setDisbleToggleButtons(false);
      }
    };

    const participantDisconnected = (participant: RemoteParticipant) => {
      if (participant.identity.split('@')[1] === PARTICIANT_TYPES.REPORTER && !isHostIn) {
        room.localParticipant.audioTracks.forEach(function(audioTrack) {
          audioTrack.track.disable();
        });
        room.localParticipant.videoTracks.forEach(function(videoTrack) {
          videoTrack.track.disable();
        });
        alert('waiting for reporter to join');
        setDisbleToggleButtons(true);
      }
    };

    room.on('participantConnected', participantConnected);
    room.on('participantDisconnected', participantDisconnected);
    return () => {
      room.off('participantConnected', participantConnected);
      room.off('participantDisconnected', participantDisconnected);
    };
  }, [room]);

  return disableToggleButtons;
}
