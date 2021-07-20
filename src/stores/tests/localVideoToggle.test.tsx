import { act } from '@testing-library/react-hooks';
import rootStore, { RootStore } from '../makeStore';
import { LocalAudioTrack, LocalVideoTrack } from 'twilio-video';
import { mockLocalParticipant } from '../../utils/mocks';

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
    jest.mock('../../stores/rootStore', () => {
      return {
        __esModule: true, // this property makes it work
        default: rootStore,
      };
    });
    let newStore = new RootStore();
    rootStore.participantsStore = newStore.participantsStore;
  });
  it('should return true when a localVideoTrack exists', () => {
    // @ts-expect-error
    rootStore.participantsStore.setVideoTrack(getMockTrack('camera-123456') as LocalVideoTrack);
    expect(rootStore.participantsStore.localVideoTrack?.name).toEqual('camera-123456');
  });

  it('should return false when a localVideoTrack does not exist', () => {
    rootStore.participantsStore.localVideoTrack = undefined;
    // @ts-expect-error
    rootStore.participantsStore.setAudioTrack(getMockTrack('microphone') as LocalAudioTrack);
    expect(rootStore.participantsStore.localVideoTrack).toEqual(undefined);
  });

  describe('toggleVideoEnabled function', () => {
    it('should remove track when toggling an active video track', () => {
      // @ts-expect-error
      rootStore.participantsStore.setVideoTrack(getMockTrack('camera-123456') as LocalVideoTrack);
      rootStore.participantsStore.setPublishingVideoTrackInProgress(false);
      rootStore.participantsStore.toggleVideoEnabled();
      expect(rootStore.participantsStore.localVideoTrack).toEqual(undefined);
    });

    it('should call localParticipant.unpublishTrack when a localVideoTrack and localParticipant exists', () => {
      // @ts-expect-error
      const mockLocalTrack = getMockTrack('camera-123456') as LocalVideoTrack;
      const localParticipant = new mockLocalParticipant('local', 'Reporter', 1);
      jest.spyOn(localParticipant, 'unpublishTrack');
      rootStore.participantsStore.localParticipant?.setParticipant(localParticipant);
      rootStore.participantsStore.setVideoTrack(mockLocalTrack);
      rootStore.participantsStore.setPublishingVideoTrackInProgress(false);
      rootStore.participantsStore.toggleVideoEnabled();

      expect(localParticipant.unpublishTrack).toHaveBeenCalledWith(mockLocalTrack);
    });

    it('should call getLocalVideoTrack when a localVideoTrack does not exist', async () => {
      jest.spyOn(rootStore.participantsStore, 'getLocalVideoTrack');
      rootStore.participantsStore.setPublishingVideoTrackInProgress(false);
      rootStore.participantsStore.localVideoTrack = undefined;
      rootStore.participantsStore.toggleVideoEnabled();
      expect(rootStore.participantsStore.getLocalVideoTrack).toHaveBeenCalled();
    });

    it('should call mockLocalParticipant.publishTrack when a localVideoTrack does not exist and localParticipant does exist', async () => {
      const localParticipant = new mockLocalParticipant('local', 'Reporter', 1);
      jest.spyOn(localParticipant, 'publishTrack');
      rootStore.participantsStore.localParticipant?.setParticipant(localParticipant);
      // @ts-expect-error
      const mockTrack = getMockTrack('mockTrack') as LocalVideoTrack;
      rootStore.participantsStore.getLocalVideoTrack = async () => mockTrack;
      await act(async () => {
        rootStore.participantsStore.localVideoTrack = undefined;
        rootStore.participantsStore.setPublishingVideoTrackInProgress(false);
        await rootStore.participantsStore.toggleVideoEnabled();
      });

      expect(localParticipant.publishTrack).toHaveBeenCalledWith(mockTrack, { priority: 'low' });
    });

    it('should not call mockLocalParticipant.publishTrack when isPublishing is true', async () => {
      const localParticipant = new mockLocalParticipant('local', 'Reporter', 1);
      jest.spyOn(rootStore.participantsStore, 'getLocalVideoTrack');
      rootStore.participantsStore.localParticipant?.setParticipant(localParticipant);
      rootStore.participantsStore.publishingVideoTrackInProgress = false;
      // @ts-expect-error
      const mockTrack = getMockTrack('mockTrack') as LocalVideoTrack;
      await act(async () => {
        await rootStore.participantsStore.toggleVideoEnabled();
      });
      rootStore.participantsStore.toggleVideoEnabled(); // Should be ignored because isPublishing is true
      expect(rootStore.participantsStore.getLocalVideoTrack).toHaveBeenCalledTimes(1);
    });

    it('should call onError when publishTrack throws an error', async () => {
      const mockGetLocalVideoTrack = jest.fn(() => {
        console.log('@@test');
        return Promise.reject('mockError');
      });
      const mockOnError = jest.fn();

      const localParticipant = new mockLocalParticipant('local', 'Reporter', 1, 1);

      localParticipant.publishTrack = jest.fn(() => Promise.reject('mockError'));

      rootStore.participantsStore.localParticipant.setParticipant(localParticipant);
      rootStore.participantsStore.localVideoTrack = undefined;
      rootStore.participantsStore.publishingVideoTrackInProgress = false;
      rootStore.participantsStore.getLocalVideoTrack = mockGetLocalVideoTrack;

      await act(async () => {
        try {
          const test = await rootStore.participantsStore.toggleVideoEnabled();
        } catch (err) {
          mockOnError(err);
        }
      });
      expect(mockOnError).toHaveBeenCalledWith('mockError');
    });
  });
});
