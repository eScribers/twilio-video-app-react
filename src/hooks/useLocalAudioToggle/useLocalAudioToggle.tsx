import { LocalAudioTrack } from 'twilio-video';
import { useCallback } from 'react';
import useIsTrackEnabled from '../useIsTrackEnabled/useIsTrackEnabled';
import useVideoContext from '../useVideoContext/useVideoContext';
import { NOTIFICATION_MESSAGE, TRACK_TYPE } from '../../utils/displayStrings';
import { useAppState } from '../../state';

export default function useLocalAudioToggle() {
  const { localTracks } = useVideoContext();
  const { setNotification } = useAppState();

  const audioTrack = localTracks.find(track => track.kind === TRACK_TYPE.AUDIO) as LocalAudioTrack;
  const isEnabled = useIsTrackEnabled(audioTrack);

  const toggleAudioEnabled = useCallback(() => {
    if (audioTrack) {
      audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
    } else {
      console.log('No audio track discovered');
      setNotification({ message: NOTIFICATION_MESSAGE.CANNOT_RECORD_AUDIO });
    }
  }, [audioTrack, setNotification]);

  return [isEnabled, toggleAudioEnabled] as const;
}
