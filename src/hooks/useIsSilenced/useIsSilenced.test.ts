import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import useIsSilenced from './useIsSilenced';
import useVideoContext from '../useVideoContext/useVideoContext';
import { PARTICIPANT_TYPES } from '../../utils/rbac/ParticipantTypes';
import { useAppState } from '../useAppState/useAppState';

jest.mock('../useVideoContext/useVideoContext');
jest.mock('../useAppState/useAppState');

const mockedVideoContext = useVideoContext as jest.Mock<any>;
const mockUseAppState = useAppState as jest.Mock<any>;
mockUseAppState.mockImplementation(() => ({ isSilenced: false, setIsSilenced: jest.fn() }));

const mockLocalParticipant = new EventEmitter() as any;

mockLocalParticipant.publishTrack = jest.fn(() => Promise.resolve('mockPublication'));
mockLocalParticipant.unpublishTrack = jest.fn();

function MockRoom() {
  const mockRoom = new EventEmitter() as any;
  const mockLocalParticipant = new EventEmitter() as any;
  mockLocalParticipant.tracks = new Map();
  mockLocalParticipant.identity = 'test@test';

  mockRoom.localParticipant = mockLocalParticipant;
  mockRoom.state = 'connected';
  mockRoom.participants = new Map([]) as any;
  return mockRoom;
}

mockedVideoContext.mockImplementation(() => ({
  room: MockRoom(),
  onError: () => {},
}));

describe('the useIsSilenced hook', () => {
  it('when there are no participants yet should return false', () => {
    const { result } = renderHook(useIsSilenced);
    console.log(result.current);

    const [_isSilenced, setIsSilenced] = result.current;
    expect(setIsSilenced).not.toHaveBeenCalled();
  });

  it('should return false when "participantConnected" is not the recorder', async () => {
    const mockRoom = MockRoom();
    const { result } = renderHook(useIsSilenced);
    const [_isSilenced, setIsSilenced] = result.current;
    act(() => {
      mockRoom.emit('participantConnected', { identity: `Reporter@${PARTICIPANT_TYPES.REPORTER_RECORDING}` });
    });
    setTimeout(() => {
      expect(setIsSilenced).toHaveBeenCalledWith(true);
    }, 2000);
  });
});
