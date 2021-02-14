import { useState, useEffect } from 'react';

export default function useDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const getDevices = async () => {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      let devices = await navigator.mediaDevices.enumerateDevices();
      setDevices(devices);
    };
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    try {
      getDevices();
    } catch (err) {
      console.error("Couldn't fetch devices");
    }

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, []);

  return {
    audioInputDevices: devices.filter(device => device.kind === 'audioinput'),
    videoInputDevices: devices.filter(device => device.kind === 'videoinput'),
    audioOutputDevices: devices.filter(device => device.kind === 'audiooutput'),
    hasAudioInputDevices: devices.filter(device => device.kind === 'audioinput').length > 0,
    hasVideoInputDevices: devices.filter(device => device.kind === 'videoinput').length > 0,
  };
}

export function useAudioInputDevices() {
  const devices = useDevices();
  return devices.audioInputDevices;
}

export function useVideoInputDevices() {
  const devices = useDevices();
  return devices.videoInputDevices;
}

export function useAudioOutputDevices() {
  const devices = useDevices();
  return devices.audioOutputDevices;
}
