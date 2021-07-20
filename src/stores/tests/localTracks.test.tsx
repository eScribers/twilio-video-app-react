import { act } from '@testing-library/react-hooks';
import Video from 'twilio-video';
import { RootStore } from '../makeStore';
import { mockLocalParticipant } from '../../utils/mocks';
import { sleep } from '../../utils';
import { MockTrack } from '../../__mocks__/twilio-video';

let rootStore = new RootStore();

const mockAudioInputDevice: MediaDeviceInfo = {
  deviceId: 'mockAudioInputDeviceId',
  label: 'mock audio device',
  groupId: 'group1',
  kind: 'audioinput',
  toJSON: () => {},
};

const mockVideoInputDevice: MediaDeviceInfo = {
  deviceId: 'mockVideoInputDeviceId',
  label: 'mock video device',
  groupId: 'group1',
  kind: 'videoinput',
  toJSON: () => {},
};

describe('the useLocalTracks hook', () => {
  beforeEach(() => {
    rootStore.participantsStore.setDevices([mockAudioInputDevice, mockVideoInputDevice]);
  });

  describe('the getAudioAndVideoTracks function', () => {
    it('should create local audio and video tracks', async () => {
      expect(rootStore.participantsStore.devices.audioInputDevices[0].kind).toBe(mockAudioInputDevice.kind);
    });
  });

  it('should create a local audio track when no video devices are present', async () => {
    rootStore.participantsStore.localParticipant?.setParticipant(new mockLocalParticipant('test', 'Reporter', 1));
    if (!rootStore.participantsStore.localParticipant?.participant) throw new Error('No local participant detected');
    jest.spyOn(rootStore.participantsStore, 'getLocalAudioTrack');
    jest.spyOn(rootStore.participantsStore, 'getLocalVideoTrack');
    rootStore.participantsStore.setDevices([mockAudioInputDevice]);
    await act(async () => {
      await rootStore.participantsStore.toggleAudioEnabled();
      await rootStore.participantsStore.toggleVideoEnabled();
    });
    expect(rootStore.participantsStore.localAudioTrack).not.toBe(undefined);
    expect(rootStore.participantsStore.getLocalVideoTrack).not.toHaveBeenCalled();
  });

  it('should create a local video track when no audio devices are present', async () => {
    (Video.createLocalAudioTrack as jest.Mock<any>).mockImplementationOnce(() => Promise.resolve()); // once for the store initialization
    const rootStore = new RootStore();
    (Video.createLocalAudioTrack as jest.Mock<any>).mockImplementationOnce(() => Promise.resolve()); // once for the test itself
    rootStore.participantsStore.localParticipant?.setParticipant(new mockLocalParticipant('test', 'Reporter', 1));
    if (!rootStore.participantsStore.localParticipant?.participant) throw new Error('No local participant detected');
    jest.spyOn(rootStore.participantsStore, 'setAudioTrack');
    jest.spyOn(rootStore.participantsStore, 'getLocalVideoTrack');
    rootStore.participantsStore.setDevices([mockVideoInputDevice]);
    await act(async () => {
      await rootStore.participantsStore.toggleAudioEnabled();
      await rootStore.participantsStore.toggleVideoEnabled();
    });
    expect(rootStore.participantsStore.getLocalVideoTrack).toHaveBeenCalled();
    expect(rootStore.participantsStore.localAudioTrack).toBe(undefined);
  });

  it('should not create any tracks when no input devices are present', async () => {
    (Video.createLocalVideoTrack as jest.Mock<any>).mockImplementationOnce(() => Promise.resolve());
    (Video.createLocalAudioTrack as jest.Mock<any>).mockImplementationOnce(() => Promise.resolve()); // once for the store initialization
    const rootStore = new RootStore();
    expect(rootStore.participantsStore.localAudioTrack).toBe(undefined);
    (Video.createLocalAudioTrack as jest.Mock<any>).mockImplementationOnce(() => Promise.resolve()); // once for the test itself

    rootStore.participantsStore.localParticipant?.setParticipant(new mockLocalParticipant('test', 'Reporter', 1));
    if (!rootStore.participantsStore.localParticipant?.participant) throw new Error('No local participant detected');
    jest.spyOn(rootStore.participantsStore, 'setAudioTrack');
    rootStore.participantsStore.setDevices([]);
    await act(async () => {
      await rootStore.participantsStore.toggleAudioEnabled();
      await rootStore.participantsStore.toggleVideoEnabled();
    });

    expect(rootStore.participantsStore.localVideoTrack).toBe(undefined);
    expect(rootStore.participantsStore.localAudioTrack).toBe(undefined);
  });

  it('should return an error when there is an error creating a track', async () => {
    (Video.createLocalVideoTrack as jest.Mock<any>).mockImplementationOnce(() => Promise.reject('testError'));
    expect(rootStore.participantsStore.getLocalVideoTrack()).rejects.toBe('testError');
  });

  describe('the removeLocalVideoTrack function', () => {
    it('should call videoTrack.stop() and remove the videoTrack from state', async () => {
      expect(rootStore.participantsStore.localVideoTrack).not.toBe(undefined);

      if (rootStore.participantsStore.localVideoTrack) jest.spyOn(rootStore.participantsStore.localVideoTrack, 'stop');

      expect(rootStore.participantsStore.localVideoTrack?.stop).not.toHaveBeenCalled();

      await act(async () => {
        await sleep(210);
        await rootStore.participantsStore.toggleVideoEnabled();
      });

      expect(rootStore.participantsStore.localVideoTrack).toBe(undefined);
    });
  });

  describe('the removeLocalAudioTrack function', () => {
    it('should call audioTrack.stop() and remove the audioTrack from state', async () => {
      (Video.createLocalAudioTrack as jest.Mock<any>).mockImplementationOnce(() =>
        Promise.resolve(new MockTrack('audioInput'))
      );

      // First, get tracks
      await act(async () => {
        await rootStore.participantsStore.toggleAudioEnabled();
      });

      expect(rootStore.participantsStore.localAudioTrack).toBeTruthy();

      if (rootStore.participantsStore.localAudioTrack)
        jest.spyOn(rootStore.participantsStore.localAudioTrack, 'disable');

      await act(async () => {
        await rootStore.participantsStore.toggleAudioEnabled();
      });

      expect(rootStore.participantsStore.localAudioTrack?.disable).toHaveBeenCalled();
    });
  });
});
