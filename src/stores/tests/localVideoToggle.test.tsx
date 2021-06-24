import { act } from '@testing-library/react-hooks';
import { LocalAudioTrack, LocalVideoTrack } from 'twilio-video';
import rootStore, { RootStore } from '../makeStore';
import { mockLocalParticipant } from '../../utils/mocks';
jest.mock('../../stores', () => {
  return {
    __esModule: true, // this property makes it work
    default: rootStore,
  };
});

function getMockTrack(name: string, deviceId?: string) {
  return {
    name,
    mediaStreamTrack: {
      getSettings: () => ({
        deviceId,
      }),
    },
    stop: jest.fn(),
    enable: jest.fn(),
    disable: jest.fn(),
  };
}

describe('the useLocalVideoToggle hook', () => {
  beforeEach(() => {
    let newStore = new RootStore();
    rootStore.participantStore = newStore.participantStore;
  });
  it('should return true when a localVideoTrack exists', () => {
    // @ts-expect-error
    rootStore.participantStore.setVideoTrack(getMockTrack('camera-123456') as LocalVideoTrack);
    expect(rootStore.participantStore.localVideoTrack?.name).toEqual('camera-123456');
  });

  it('should return false when a localVideoTrack does not exist', () => {
    // @ts-expect-error
    rootStore.participantStore.setAudioTrack(getMockTrack('microphone') as LocalAudioTrack);
    expect(rootStore.participantStore.localVideoTrack).toEqual(undefined);
  });

  describe('toggleVideoEnabled function', () => {
    beforeEach(() => {
      let newStore = new RootStore();
      rootStore.participantStore = newStore.participantStore;
    });
    it('should remove track when toggling an active video track', () => {
      // @ts-expect-error
      rootStore.participantStore.setVideoTrack(getMockTrack('camera-123456') as LocalVideoTrack);
      rootStore.participantStore.toggleVideoEnabled();
      expect(rootStore.participantStore.localVideoTrack).toEqual(undefined);
    });

    it('should call localParticipant.unpublishTrack when a localVideoTrack and localParticipant exists', () => {
      // @ts-expect-error
      const mockLocalTrack = getMockTrack('camera-123456') as LocalVideoTrack;
      const localParticipant = new mockLocalParticipant();
      jest.spyOn(localParticipant, 'unpublishTrack');
      rootStore.participantStore.setParticipant(localParticipant);
      rootStore.participantStore.setVideoTrack(mockLocalTrack);
      rootStore.participantStore.toggleVideoEnabled();

      expect(localParticipant.unpublishTrack).toHaveBeenCalledWith(mockLocalTrack);
    });

    it('should call getLocalVideoTrack when a localVideoTrack does not exist', async () => {
      jest.spyOn(rootStore.participantStore, 'getLocalVideoTrack');
      rootStore.participantStore.toggleVideoEnabled();
      expect(rootStore.participantStore.getLocalVideoTrack).toHaveBeenCalled();
    });

    it('should call mockLocalParticipant.publishTrack when a localVideoTrack does not exist and localParticipant does exist', async () => {
      const localParticipant = new mockLocalParticipant();
      jest.spyOn(localParticipant, 'publishTrack');
      rootStore.participantStore.setParticipant(localParticipant);
      // @ts-expect-error
      const mockTrack = getMockTrack('mockTrack') as LocalVideoTrack;
      rootStore.participantStore.getLocalVideoTrack = async () => mockTrack;
      await act(async () => {
        await rootStore.participantStore.toggleVideoEnabled();
      });

      expect(localParticipant.publishTrack).toHaveBeenCalledWith(mockTrack, { priority: 'low' });
    });

    it('should not call mockLocalParticipant.publishTrack when isPublishing is true', async () => {
      const localParticipant = new mockLocalParticipant();
      jest.spyOn(rootStore.participantStore, 'getLocalVideoTrack');
      rootStore.participantStore.setParticipant(localParticipant);
      // @ts-expect-error
      const mockTrack = getMockTrack('mockTrack') as LocalVideoTrack;
      await act(async () => {
        await rootStore.participantStore.toggleVideoEnabled();
      });
      rootStore.participantStore.toggleVideoEnabled(); // Should be ignored because isPublishing is true
      expect(rootStore.participantStore.getLocalVideoTrack).toHaveBeenCalledTimes(1);
    });

    it('should call onError when publishTrack throws an error', async () => {
      const mockGetLocalVideoTrack = jest.fn(() => Promise.reject('mockError'));
      const mockOnError = jest.fn();

      const localParticipant = new mockLocalParticipant();

      localParticipant.publishTrack = jest.fn(() => Promise.reject('mockError'));
      rootStore.participantStore.getLocalVideoTrack = mockGetLocalVideoTrack;
      rootStore.participantStore.setParticipant(localParticipant);
      await act(async () => {
        try {
          await rootStore.participantStore.toggleVideoEnabled();
        } catch (err) {
          mockOnError(err);
        }
      });
      expect(mockOnError).toHaveBeenCalledWith('mockError');
    });
  });
});
