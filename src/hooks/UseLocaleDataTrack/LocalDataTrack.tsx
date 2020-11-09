import { LocalDataTrack } from 'twilio-video';
import { useCallback } from 'react';
import useIsTrackEnabled from '../useIsTrackEnabled/useIsTrackEnabled';
import useVideoContext from '../useVideoContext/useVideoContext';
import { TRACK_TYPE } from '../../utils/displayStrings';

export default function UseLocalDataTrack() {
  const { localTracks } = useVideoContext();
  const dataTrack = localTracks.find(track => track.kind === TRACK_TYPE.DATA) as LocalDataTrack;

  const toggleAudioEnabled = useCallback(() => {
    if (dataTrack) {
    }
  }, [dataTrack]);

  return [track, toggleAudioEnabled] as const;
}
