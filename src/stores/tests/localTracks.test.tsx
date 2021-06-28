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
    rootStore.participantStore.setDevices([mockAudioInputDevice, mockVideoInputDevice]);
  });

  describe('the getAudioAndVideoTracks function', () => {
    it('should create local audio and video tracks', async () => {
      expect(rootStore.participantStore.devices.audioInputDevices[0].kind).toBe(mockAudioInputDevice.kind);
    });
  });

  it('should create a local audio track when no video devices are present', async () => {
    rootStore.participantStore.setParticipant(new mockLocalParticipant());
    if (!rootStore.participantStore.participant) throw new Error('No local participant detected');
    jest.spyOn(rootStore.participantStore, 'getLocalAudioTrack');
    jest.spyOn(rootStore.participantStore, 'getLocalVideoTrack');
    rootStore.participantStore.setDevices([mockAudioInputDevice]);
    await act(async () => {
      await rootStore.participantStore.toggleAudioEnabled();
      await rootStore.participantStore.toggleVideoEnabled();
    });
    expect(rootStore.participantStore.localAudioTrack).not.toBe(undefined);
    expect(rootStore.participantStore.getLocalVideoTrack).not.toHaveBeenCalled();
  });

  it('should create a local video track when no audio devices are present', async () => {
    (Video.createLocalAudioTrack as jest.Mock<any>).mockImplementationOnce(() => Promise.resolve()); // once for the store initialization
    const rootStore = new RootStore();
    (Video.createLocalAudioTrack as jest.Mock<any>).mockImplementationOnce(() => Promise.resolve()); // once for the test itself
    rootStore.participantStore.setParticipant(new mockLocalParticipant());
    if (!rootStore.participantStore.participant) throw new Error('No local participant detected');
    jest.spyOn(rootStore.participantStore, 'setAudioTrack');
    jest.spyOn(rootStore.participantStore, 'getLocalVideoTrack');
    rootStore.participantStore.setDevices([mockVideoInputDevice]);
    await act(async () => {
      await rootStore.participantStore.toggleAudioEnabled();
      await rootStore.participantStore.toggleVideoEnabled();
    });
    expect(rootStore.participantStore.getLocalVideoTrack).toHaveBeenCalled();
    expect(rootStore.participantStore.localAudioTrack).toBe(undefined);
  });

  it('should not create any tracks when no input devices are present', async () => {
    (Video.createLocalVideoTrack as jest.Mock<any>).mockImplementationOnce(() => Promise.resolve());
    (Video.createLocalAudioTrack as jest.Mock<any>).mockImplementationOnce(() => Promise.resolve()); // once for the store initialization
    const rootStore = new RootStore();
    expect(rootStore.participantStore.localAudioTrack).toBe(undefined);
    (Video.createLocalAudioTrack as jest.Mock<any>).mockImplementationOnce(() => Promise.resolve()); // once for the test itself

    rootStore.participantStore.setParticipant(new mockLocalParticipant());
    if (!rootStore.participantStore.participant) throw new Error('No local participant detected');
    jest.spyOn(rootStore.participantStore, 'setAudioTrack');
    rootStore.participantStore.setDevices([]);
    await act(async () => {
      await rootStore.participantStore.toggleAudioEnabled();
      await rootStore.participantStore.toggleVideoEnabled();
    });

    expect(rootStore.participantStore.localVideoTrack).toBe(undefined);
    expect(rootStore.participantStore.localAudioTrack).toBe(undefined);
  });

  it('should return an error when there is an error creating a track', async () => {
    (Video.createLocalVideoTrack as jest.Mock<any>).mockImplementationOnce(() => Promise.reject('testError'));
    expect(rootStore.participantStore.getLocalVideoTrack()).rejects.toBe('testError');
  });

  describe('the removeLocalVideoTrack function', () => {
    it('should call videoTrack.stop() and remove the videoTrack from state', async () => {
      expect(rootStore.participantStore.localVideoTrack).not.toBe(undefined);

      if (rootStore.participantStore.localVideoTrack) jest.spyOn(rootStore.participantStore.localVideoTrack, 'stop');

      expect(rootStore.participantStore.localVideoTrack?.stop).not.toHaveBeenCalled();

      await act(async () => {
        await sleep(210);
        await rootStore.participantStore.toggleVideoEnabled();
      });

      expect(rootStore.participantStore.localVideoTrack).toBe(undefined);
    });
  });

  describe('the removeLocalAudioTrack function', () => {
    it('should call audioTrack.stop() and remove the audioTrack from state', async () => {
      (Video.createLocalAudioTrack as jest.Mock<any>).mockImplementationOnce(() =>
        Promise.resolve(new MockTrack('audioInput'))
      );

      // First, get tracks
      await act(async () => {
        await rootStore.participantStore.toggleAudioEnabled();
      });

      expect(rootStore.participantStore.localAudioTrack).toBeTruthy();

      if (rootStore.participantStore.localAudioTrack) jest.spyOn(rootStore.participantStore.localAudioTrack, 'disable');

      await act(async () => {
        await rootStore.participantStore.toggleAudioEnabled();
      });

      expect(rootStore.participantStore.localAudioTrack?.disable).toHaveBeenCalled();
    });
  });
});
