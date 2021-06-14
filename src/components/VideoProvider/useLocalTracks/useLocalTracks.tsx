import { DEFAULT_VIDEO_CONSTRAINTS, SELECTED_AUDIO_INPUT_KEY, SELECTED_VIDEO_INPUT_KEY } from '../../../constants';
import { useCallback, useState } from 'react';
import Video, { LocalVideoTrack, LocalAudioTrack, CreateLocalTrackOptions } from 'twilio-video';
import useDevices from '../../../hooks/useDevices/useDevices';
import { TRACK_TYPE } from '../../../utils/displayStrings';

export default function useLocalTracks() {
  const [audioTrack, setAudioTrack] = useState<LocalAudioTrack>();
  const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();
  const [isAcquiringLocalTracks, setIsAcquiringLocalTracks] = useState(false);
  const { audioInputDevices, videoInputDevices, hasAudioInputDevices, hasVideoInputDevices } = useDevices();

  const getLocalAudioTrack = useCallback((deviceId?: string, groupId?: string) => {
    const options: CreateLocalTrackOptions = {};

    if (deviceId) {
      options.deviceId = { exact: deviceId };
      options.groupId = { exact: groupId };
    }

    return Video.createLocalAudioTrack(options)
      .then(newTrack => {
        setAudioTrack(newTrack);
        return newTrack;
      })
      .catch(err => {
        console.log('No microphone attached.');
      });
  }, []);

  const getLocalVideoTrack = useCallback(() => {
    const selectedVideoDeviceId = window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY);

    const hasSelectedVideoDevice = videoInputDevices.some(
      device => selectedVideoDeviceId && device.deviceId === selectedVideoDeviceId
    );

    const options: CreateLocalTrackOptions = {
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      name: `camera-${Date.now()}`,
      ...(hasSelectedVideoDevice && { deviceId: { exact: selectedVideoDeviceId! } }),
    };

    return Video.createLocalVideoTrack(options).then(newTrack => {
      setVideoTrack(newTrack);
      return newTrack;
    });
  }, [videoInputDevices]);

  const removeLocalAudioTrack = useCallback(() => {
    if (audioTrack) {
      audioTrack.stop();
      setAudioTrack(undefined);
    }
  }, [audioTrack]);

  const removeLocalVideoTrack = useCallback(() => {
    if (videoTrack) {
      videoTrack.stop();
      setVideoTrack(undefined);
    }
  }, [videoTrack]);

  // Todo Move this to the store:::
  const getAudioAndVideoTracks = useCallback(() => {
    if (!hasAudioInputDevices && !hasVideoInputDevices) return Promise.resolve();
    if (isAcquiringLocalTracks || audioTrack || videoTrack) return Promise.resolve();

    setIsAcquiringLocalTracks(true);

    const selectedAudioDeviceId = window.localStorage.getItem(SELECTED_AUDIO_INPUT_KEY);
    const selectedVideoDeviceId = window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY);

    const hasSelectedAudioDevice = audioInputDevices.some(
      device => selectedAudioDeviceId && device.deviceId === selectedAudioDeviceId
    );
    const hasSelectedVideoDevice = videoInputDevices.some(
      device => selectedVideoDeviceId && device.deviceId === selectedVideoDeviceId
    );

    const localTrackConstraints = {
      video: hasVideoInputDevices && {
        ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
        name: `camera-${Date.now()}`,
        ...(hasSelectedVideoDevice && { deviceId: { exact: selectedVideoDeviceId! } }),
      },
      audio: hasSelectedAudioDevice ? { deviceId: { exact: selectedAudioDeviceId! } } : hasAudioInputDevices,
    };

    return Video.createLocalTracks(localTrackConstraints)
      .then(tracks => {
        const videoTrack = tracks.find(track => track.kind === TRACK_TYPE.VIDEO);
        const audioTrack = tracks.find(track => track.kind === TRACK_TYPE.AUDIO);
        if (videoTrack) {
          setVideoTrack(videoTrack as LocalVideoTrack);
        }
        if (audioTrack) {
          setAudioTrack(audioTrack as LocalAudioTrack);
        }
      })
      .finally(() => setIsAcquiringLocalTracks(false));
  }, [
    hasAudioInputDevices,
    hasVideoInputDevices,
    audioTrack,
    videoTrack,
    audioInputDevices,
    videoInputDevices,
    isAcquiringLocalTracks,
  ]);

  const localTracks = [audioTrack, videoTrack].filter(track => track !== undefined) as (
    | LocalAudioTrack
    | LocalVideoTrack
  )[];

  return {
    localTracks,
    getLocalVideoTrack,
    getLocalAudioTrack,
    isAcquiringLocalTracks,
    removeLocalAudioTrack,
    removeLocalVideoTrack,
    getAudioAndVideoTracks,
  };
}
