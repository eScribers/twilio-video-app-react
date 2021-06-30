import { act } from '@testing-library/react-hooks';
import { RootStore } from '../makeStore';

let mockDevices = [
  { deviceId: 1, label: '1', kind: 'audioinput' },
  { deviceId: 2, label: '2', kind: 'videoinput' },
  { deviceId: 3, label: '3', kind: 'audiooutput' },
];

describe('the useDevices hook', () => {
  let roomsStore: any;
  let participantsStore: any;

  beforeEach(() => {
    const rootStore = new RootStore();
    roomsStore = rootStore.roomsStore;
    participantsStore = rootStore.participantsStore;
  });

  it('should correctly return a list of audio input devices', async () => {
    act(() => {
      participantsStore.setDevices(mockDevices);
    });

    expect(participantsStore.devices).toMatchInlineSnapshot(`
      Object {
        "audioInputDevices": Array [
          Object {
            "deviceId": 1,
            "kind": "audioinput",
            "label": "1",
          },
        ],
        "audioOutputDevices": Array [
          Object {
            "deviceId": 3,
            "kind": "audiooutput",
            "label": "3",
          },
        ],
        "hasAudioInputDevices": true,
        "hasVideoInputDevices": true,
        "videoInputDevices": Array [
          Object {
            "deviceId": 2,
            "kind": "videoinput",
            "label": "2",
          },
        ],
      }
    `);
  });

  it('should return hasAudioInputDevices: false when there are no audio input devices', async () => {
    act(() => {
      navigator.mediaDevices.enumerateDevices = () =>
        // @ts-ignore
        Promise.resolve([
          { deviceId: 2, label: '2', kind: 'videoinput' },
          { deviceId: 3, label: '3', kind: 'audiooutput' },
        ]);
    });
    setTimeout(() => {
      expect(participantsStore.devices.hasAudioInputDevices).toBe(false);
    });
  });

  it('should return hasAudioInputDevices: false when there are no audio input devices', async () => {
    act(() => {
      navigator.mediaDevices.enumerateDevices = () =>
        // @ts-ignore
        Promise.resolve([
          { deviceId: 1, label: '1', kind: 'audioinput' },
          { deviceId: 3, label: '3', kind: 'audiooutput' },
        ]);
    });
    setTimeout(() => {
      expect(participantsStore.devices.hasVideoInputDevices).toBe(false);
    }, 50);
  });

  it('should respond to "devicechange" events', async () => {
    // @ts-ignore
    navigator.mediaDevices.enumerateDevices = () => Promise.resolve(mockDevices);
    setTimeout(() => {
      expect(participantsStore.setDevices).toHaveBeenCalledWith(mockDevices);
    }, 200);

    act(() => {
      navigator.mediaDevices.enumerateDevices = () =>
        // @ts-ignore
        Promise.resolve([{ deviceId: 2, label: '2', kind: 'audioinput' }]);
    });
    setTimeout(() => {
      expect(participantsStore.devices.audioInputDevices).toEqual([{ deviceId: 2, label: '2', kind: 'audioinput' }]);
    }, 50);
  });
});
