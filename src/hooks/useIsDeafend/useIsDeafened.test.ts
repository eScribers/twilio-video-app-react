import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import useIsDeafened from './useIsDeafened';
import useVideoContext from '../useVideoContext/useVideoContext';
import { PARTICIPANT_TYPES } from '../../utils/rbac/ParticipantTypes';
import { useAppState } from '../../state';

jest.mock('../useVideoContext/useVideoContext');
jest.mock('../../state');

const mockedVideoContext = useVideoContext as jest.Mock<any>;
const mockUseAppState = useAppState as jest.Mock<any>;
mockUseAppState.mockImplementation(() => ({ isDeafened: false, setIsDeafened: jest.fn() }));

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

describe('the useIsDeafened hook', () => {
  it('when there are no participants yet should return false', () => {
    const { result } = renderHook(useIsDeafened);
    console.log(result.current);

    const [_isDeafened, setIsDeafened] = result.current;
    expect(setIsDeafened).not.toHaveBeenCalled();
  });

  it('should return false when "participantConnected" is not the recorder', async () => {
    const mockRoom = MockRoom();
    const { result } = renderHook(useIsDeafened);
    const [_isDeafened, setIsDeafened] = result.current;
    act(() => {
      mockRoom.emit('participantConnected', { identity: `Reporter@${PARTICIPANT_TYPES.REPORTER_RECORDING}` });
    });
    setTimeout(() => {
      expect(setIsDeafened).toHaveBeenCalledWith(true);
    }, 2000);
  });
});
