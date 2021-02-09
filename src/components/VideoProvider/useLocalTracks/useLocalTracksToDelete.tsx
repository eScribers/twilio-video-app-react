import { useCallback, useEffect, useState } from 'react';
import Video, { LocalVideoTrack, LocalAudioTrack, CreateLocalTrackOptions } from 'twilio-video';
import { PLAYER_STATE } from '../../../utils/displayStrings';

import useMediaDevices from '../../../hooks/useMediaDevices/useMediaDevices';
import usePrevious from '../../../hooks/usePrevious/usePrevious';
import { useAppState } from '../../../state';

function isSameDevice(prevDefaultDevice, newDefaultDevice) {
  if (!prevDefaultDevice) return false;
  return (
    prevDefaultDevice.deviceId === newDefaultDevice.deviceId &&
    prevDefaultDevice.groupId === newDefaultDevice.groupId &&
    prevDefaultDevice.label === newDefaultDevice.label
  );
}
export function useLocalAudioTrack() {
  const [audioTrack, setAudioTrack] = useState<LocalAudioTrack>();
  const { defaultDevice } = useMediaDevices('audioinput');
  const prevDefaultDevice = usePrevious(defaultDevice);
  const { selectedAudioInput } = useAppState();
  const options: CreateLocalTrackOptions = {};
  useEffect(() => {
    if (!isSameDevice(prevDefaultDevice, defaultDevice)) {
      console.log('auto', defaultDevice.label);
    }
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [defaultDevice]);

  useEffect(() => {
    console.log('manual', selectedAudioInput.label);
  }, [selectedAudioInput]);

  useEffect(() => {
    Video.createLocalAudioTrack({
      deviceId: defaultDevice.deviceId,
      groupId: defaultDevice.groupId,
    })
      .then((newTrack: any) => {
        setAudioTrack(newTrack);
      })
      .catch(err => {
        console.log('No microphone attached.');
      });
  }, [defaultDevice]);

  useEffect(() => {
    Video.createLocalAudioTrack({
      deviceId: selectedAudioInput.deviceId,
      groupId: selectedAudioInput.groupId,
    })
      .then((newTrack: any) => {
        setAudioTrack(newTrack);
      })
      .catch(err => {
        console.log('No microphone attached.');
      });
  }, [selectedAudioInput]);

  useEffect(() => {
    const handleStopped = () => setAudioTrack(undefined);
    if (audioTrack) {
      audioTrack.on(PLAYER_STATE.stopped, handleStopped);
      return () => {
        audioTrack.off(PLAYER_STATE.stopped, handleStopped);
      };
    }
  }, [audioTrack]);

  return audioTrack;
}

export function useLocalVideoTrack() {
  const [track, setTrack] = useState<any>();

  const { selectedVideoInput } = useAppState();

  const getLocalVideoTrack = useCallback(
    () =>
      Video.createLocalVideoTrack({
        deviceId: selectedVideoInput.deviceId,
        groupId: selectedVideoInput.groupId,
        frameRate: 24,
        height: 720,
        width: 1280,
      })
        .then((newTrack: any) => {
          setTrack(newTrack);
          return newTrack;
        })
        .catch(err => {
          if (err.message === 'Requested device not found') {
            console.log('No camera attached.');
          }
        }),
    [selectedVideoInput]
  );

  useEffect(() => {
    // We get a new local video track when the app loads.
    getLocalVideoTrack();
  }, [selectedVideoInput, getLocalVideoTrack]);

  useEffect(() => {
    console.log('manual', selectedVideoInput.label);
  }, [selectedVideoInput]);

  useEffect(() => {
    const handleStopped = () => setTrack(undefined);
    if (track) {
      track.on(PLAYER_STATE.stopped, handleStopped);
      return () => {
        track.off(PLAYER_STATE.stopped, handleStopped);
      };
    }
  }, [track]);

  return [track, getLocalVideoTrack];
}

export default function useLocalTracks() {
  const getLocalAudioTrack = useLocalAudioTrack();
  const [videoTrack, getLocalVideoTrack] = useLocalVideoTrack();
  const [isAcquiringLocalTracks, setIsAcquiringLocalTracks] = useState(false);
  const [videoTrack2, setVideoTrack] = useState<LocalVideoTrack>();
  //const [audioTrack, setAudioTrack] = useState<LocalAudioTrack>();
  const removeLocalVideoTrack = useCallback(() => {
    if (videoTrack) {
      videoTrack.stop();
      setVideoTrack(undefined);
    }
  }, [videoTrack]);
  const localTracks: (LocalAudioTrack | LocalVideoTrack)[] = [getLocalAudioTrack, videoTrack].filter(
    track => track !== undefined
  );
  return { localTracks, getLocalVideoTrack, getLocalAudioTrack, isAcquiringLocalTracks, removeLocalVideoTrack };
}
