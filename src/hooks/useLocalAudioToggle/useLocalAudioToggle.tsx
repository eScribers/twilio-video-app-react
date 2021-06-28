import { LocalAudioTrack } from 'twilio-video';
import { useCallback } from 'react';
import useIsTrackEnabled from '../useIsTrackEnabled/useIsTrackEnabled';
import { NOTIFICATION_MESSAGE, TRACK_TYPE } from '../../utils/displayStrings';
import rootStore from '../../stores';

const useLocalAudioToggle = () => {
  const { roomStore, participantStore } = rootStore;

  const audioTrack = participantStore.localTracks.find(track => track?.kind === TRACK_TYPE.AUDIO) as LocalAudioTrack;
  const isEnabled = useIsTrackEnabled(audioTrack);

  const toggleAudioEnabled = useCallback(() => {
    if (audioTrack) {
      audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
    } else {
      console.log('No audio track discovered');
      roomStore.setNotification({ message: NOTIFICATION_MESSAGE.CANNOT_RECORD_AUDIO });
    }
  }, [audioTrack, roomStore]);

  return [isEnabled, toggleAudioEnabled] as const;
};

export default useLocalAudioToggle;
