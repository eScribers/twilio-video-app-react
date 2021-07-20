import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';
import rootStore from '../../stores/rootStore';

interface AudioTrackProps {
  track: IAudioTrack;
}

const AudioTrack = ({ track }: AudioTrackProps) => {
  const { roomsStore } = rootStore;
  const { activeSinkId } = roomsStore;

  const audioEl = useRef<HTMLAudioElement>();

  useEffect(() => {
    audioEl.current = track.attach();
    audioEl.current.setAttribute('data-cy-audio-track-name', track.name);
    document.body.appendChild(audioEl.current);
    return () => track.detach().forEach(el => el.remove());
  }, [track]);

  useEffect(() => {
    if (!activeSinkId) return;
    audioEl.current?.setSinkId?.(activeSinkId);
  }, [activeSinkId]);

  return null;
};

export default observer(AudioTrack);
