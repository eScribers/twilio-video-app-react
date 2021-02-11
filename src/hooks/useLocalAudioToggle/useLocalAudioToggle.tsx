import { LocalAudioTrack } from 'twilio-video';
import { useCallback } from 'react';
import useIsTrackEnabled from '../useIsTrackEnabled/useIsTrackEnabled';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useLocalAudioToggle() {
  const { localTracks } = useVideoContext();
  console.log(localTracks);

  const audioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;
  const isEnabled = useIsTrackEnabled(audioTrack);

  const toggleAudioEnabled = useCallback(() => {
    if (audioTrack) {
      audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
    } else {
      console.log('No audio track discovered');
    }
  }, [audioTrack]);

  return [isEnabled, toggleAudioEnabled] as const;
}
