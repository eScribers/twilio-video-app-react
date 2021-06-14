import { LocalVideoTrack } from 'twilio-video';
import { useCallback, useState } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';
import { TRACK_TYPE } from '../../utils/displayStrings';
import rootStore from '../../stores';

export default function useLocalVideoToggle() {
  const { localTracks, getLocalVideoTrack, removeLocalVideoTrack, onError } = useVideoContext();
  const { participantStore } = rootStore;
  const { participant } = participantStore;
  const videoTrack = localTracks.find(track => track.name.includes(TRACK_TYPE.CAMERA)) as LocalVideoTrack;
  const [isPublishing, setIspublishing] = useState(false);

  const toggleVideoEnabled = useCallback(() => {
    if (!isPublishing) {
      if (videoTrack) {
        const localTrackPublication = participant?.unpublishTrack(videoTrack);
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        participant?.emit('trackUnpublished', localTrackPublication);
        removeLocalVideoTrack();
      } else {
        setIspublishing(true);
        participantStore.getLocalVideoTrack();
        getLocalVideoTrack()
          .then((track: LocalVideoTrack) => participant?.publishTrack(track, { priority: 'low' }))
          .catch(onError)
          .finally(() => setIspublishing(false));
      }
    }
  }, [videoTrack, participant, getLocalVideoTrack, isPublishing, onError, removeLocalVideoTrack]);

  return [!!videoTrack, toggleVideoEnabled] as const;
}
