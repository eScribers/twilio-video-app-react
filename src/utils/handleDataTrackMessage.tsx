import ToggleAudioButton from '../components/Controls/ToggleAudioButton/ToggleAudioButton';

export function handleDataTrackMessage(message: string) {
  switch (message) {
    case 'host is in':
      ToggleAudioButton({ disabled: false });
      alert('Reporter arrived you can unmute yourselfe');
    case 'host left':
      ToggleAudioButton({ disabled: true });
  }
}
