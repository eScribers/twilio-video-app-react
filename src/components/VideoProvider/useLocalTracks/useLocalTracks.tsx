import { DEFAULT_VIDEO_CONSTRAINTS, SELECTED_AUDIO_INPUT_KEY, SELECTED_VIDEO_INPUT_KEY } from '../../../constants';
import { useCallback, useEffect, useState } from 'react';
import Video, { LocalVideoTrack, LocalAudioTrack, CreateLocalTrackOptions } from 'twilio-video';
import useDevices from 'components/MenuBar/DeviceSelector/deviceHooks/deviceHooks';
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

  const getLocalVideoTrack = useCallback(
    (newOptions?: CreateLocalTrackOptions) => {
      // In the DeviceSelector and FlipCameraButton components, a new video track is created,
      // then the old track is unpublished and the new track is published. Unpublishing the old
      // track and publishing the new track at the same time sometimes causes a conflict when the
      // track name is 'camera', so here we append a timestamp to the track name to avoid the
      // conflict.
      const selectedVideoDeviceId = window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY);

      const hasSelectedVideoDevice = videoInputDevices.some(
        device => selectedVideoDeviceId && device.deviceId === selectedVideoDeviceId
      );

      const options: CreateLocalTrackOptions = {
        ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
        name: `camera-${Date.now()}`,
        ...(hasSelectedVideoDevice && { deviceId: { exact: selectedVideoDeviceId! } }),
        ...newOptions,
      };

      return Video.createLocalVideoTrack(options).then(newTrack => {
        setVideoTrack(newTrack);
        return newTrack;
      });
    },
    [videoInputDevices]
  );

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

  useEffect(() => {
    if (!hasAudioInputDevices && !hasVideoInputDevices) return;
    if (isAcquiringLocalTracks || audioTrack || videoTrack) return;

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

    Video.createLocalTracks(localTrackConstraints)
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
      .catch(err => {
        if (err.message === 'Requested device not found') {
          console.log('No camera attached.');
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
  };
}
