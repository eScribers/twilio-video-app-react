import { useEffect, useRef } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';
import { useAppState } from '../../hooks/useAppState/useAppState';

interface AudioTrackProps {
  track: IAudioTrack;
}

export default function AudioTrack({ track }: AudioTrackProps) {
  const { activeSinkId } = useAppState();
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
}
