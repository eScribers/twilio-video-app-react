import { PARTICIANT_TYPES } from '../../utils/participantTypes';
import useVideoContext from '../useVideoContext/useVideoContext';
import { useEffect, useState } from 'react';
import { RemoteParticipant } from 'twilio-video';
import useIsHosetIn from '../useIsHosetIn/useIsHostIn';
import { Callback } from '../../types';
import { NOTIFICATION_MESSAGE } from '../../utils/displayStrings';

export default function useDisbleToggleButtons(onNotification: Callback) {
  const { room } = useVideoContext();
  const isHostIn = useIsHosetIn();
  const [disableToggleButtons, setDisbleToggleButtons] = useState(false);

  useEffect(() => {
    if (!isHostIn) {
      /* room.localParticipant.audioTracks.forEach(function(audioTrack) {
        audioTrack.track.disable();
      });*/
      /* room.localParticipant.videoTracks.forEach(function(videoTrack) {
          videoTrack.track.disable();
        });*/
      onNotification({ message: NOTIFICATION_MESSAGE.WAITING_FOR_REPORTER });
      // alert('waiting for reporter to join');
      setDisbleToggleButtons(true);
    }
  }, [room]);

  //return true;

  useEffect(() => {
    const participantConnected = (participant: RemoteParticipant) => {
      if (participant.identity.split('@')[1] === PARTICIANT_TYPES.REPORTER) {
        // alert('Reporter has joind please unmute your microphon');
        onNotification({ message: NOTIFICATION_MESSAGE.REPORTER_HAS_JOINED });
        setDisbleToggleButtons(false);
      }
    };

    const participantDisconnected = (participant: RemoteParticipant) => {
      if (participant.identity.split('@')[1] === PARTICIANT_TYPES.REPORTER && !isHostIn) {
        /*   room.localParticipant.audioTracks.forEach(function(audioTrack) {
          audioTrack.track.disable();
        });*/
        /* room.localParticipant.videoTracks.forEach(function(videoTrack) {
          videoTrack.track.disable();
        });*/
        onNotification({ message: NOTIFICATION_MESSAGE.WAITING_FOR_REPORTER });
        // alert('waiting for reporter to join');
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
