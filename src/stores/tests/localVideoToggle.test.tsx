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
    rootStore.participantsStore = newStore.participantsStore;
  });
  it('should return true when a localVideoTrack exists', () => {
    // @ts-expect-error
    rootStore.participantsStore.setVideoTrack(getMockTrack('camera-123456') as LocalVideoTrack);
    expect(rootStore.participantsStore.localVideoTrack?.name).toEqual('camera-123456');
  });

  it('should return false when a localVideoTrack does not exist', () => {
    // @ts-expect-error
    rootStore.participantsStore.setAudioTrack(getMockTrack('microphone') as LocalAudioTrack);
    expect(rootStore.participantsStore.localVideoTrack).toEqual(undefined);
  });

  describe('toggleVideoEnabled function', () => {
    beforeEach(() => {
      let newStore = new RootStore();
      rootStore.participantsStore = newStore.participantsStore;
    });
    it('should remove track when toggling an active video track', () => {
      // @ts-expect-error
      rootStore.participantsStore.setVideoTrack(getMockTrack('camera-123456') as LocalVideoTrack);
      rootStore.participantsStore.toggleVideoEnabled();
      expect(rootStore.participantsStore.localVideoTrack).toEqual(undefined);
    });

    it('should call localParticipant.unpublishTrack when a localVideoTrack and localParticipant exists', () => {
      // @ts-expect-error
      const mockLocalTrack = getMockTrack('camera-123456') as LocalVideoTrack;
      const localParticipant = new mockLocalParticipant();
      jest.spyOn(localParticipant, 'unpublishTrack');
      rootStore.participantsStore.localParticipant?.setParticipant(localParticipant);
      rootStore.participantsStore.setVideoTrack(mockLocalTrack);
      rootStore.participantsStore.toggleVideoEnabled();

      expect(localParticipant.unpublishTrack).toHaveBeenCalledWith(mockLocalTrack);
    });

    it('should call getLocalVideoTrack when a localVideoTrack does not exist', async () => {
      jest.spyOn(rootStore.participantsStore, 'getLocalVideoTrack');
      rootStore.participantsStore.toggleVideoEnabled();
      expect(rootStore.participantsStore.getLocalVideoTrack).toHaveBeenCalled();
    });

    it('should call mockLocalParticipant.publishTrack when a localVideoTrack does not exist and localParticipant does exist', async () => {
      const localParticipant = new mockLocalParticipant();
      jest.spyOn(localParticipant, 'publishTrack');
      rootStore.participantsStore.localParticipant?.setParticipant(localParticipant);
      // @ts-expect-error
      const mockTrack = getMockTrack('mockTrack') as LocalVideoTrack;
      rootStore.participantsStore.getLocalVideoTrack = async () => mockTrack;
      await act(async () => {
        await rootStore.participantsStore.toggleVideoEnabled();
      });

      expect(localParticipant.publishTrack).toHaveBeenCalledWith(mockTrack, { priority: 'low' });
    });

    it('should not call mockLocalParticipant.publishTrack when isPublishing is true', async () => {
      const localParticipant = new mockLocalParticipant();
      jest.spyOn(rootStore.participantsStore, 'getLocalVideoTrack');
      rootStore.participantsStore.localParticipant?.setParticipant(localParticipant);
      // @ts-expect-error
      const mockTrack = getMockTrack('mockTrack') as LocalVideoTrack;
      await act(async () => {
        await rootStore.participantsStore.toggleVideoEnabled();
      });
      rootStore.participantsStore.toggleVideoEnabled(); // Should be ignored because isPublishing is true
      expect(rootStore.participantsStore.getLocalVideoTrack).toHaveBeenCalledTimes(1);
    });

    it('should call onError when publishTrack throws an error', async () => {
      const mockGetLocalVideoTrack = jest.fn(() => Promise.reject('mockError'));
      const mockOnError = jest.fn();

      const localParticipant = new mockLocalParticipant();

      localParticipant.publishTrack = jest.fn(() => Promise.reject('mockError'));
      rootStore.participantsStore.getLocalVideoTrack = mockGetLocalVideoTrack;
      rootStore.participantsStore.localParticipant?.setParticipant(localParticipant);
      await act(async () => {
        try {
          await rootStore.participantsStore.toggleVideoEnabled();
        } catch (err) {
          mockOnError(err);
        }
      });
      expect(mockOnError).toHaveBeenCalledWith('mockError');
    });
  });
});
