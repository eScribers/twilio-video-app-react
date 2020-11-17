import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import useIsHosetIn from './useIsHostIn';
import useVideoContext from '../useVideoContext/useVideoContext';
import { NOTIFICATION_MESSAGE } from '../../utils/displayStrings';

jest.mock('../useVideoContext/useVideoContext');
jest.mock('../useDominantSpeaker/useDominantSpeaker');

const onmsg = jest.fn(() => {});

const mockedVideoContext = useVideoContext as jest.Mock<any>;

describe('the useIsHosetIn hook', () => {
  let mockRoom: any;

  beforeEach(() => {
    mockRoom = new EventEmitter();
    mockedVideoContext.mockImplementation(() => ({
      room: mockRoom,
    }));
  });

  it('should return true by default', () => {
    const { result } = renderHook(useIsHosetIn(onmsg));
    expect(result.current).toEqual(true);
  });

  it('should return false when "participantConnected" is not the host', async () => {
    const { result } = renderHook(useIsHosetIn(onmsg));
    act(() => {
      mockRoom.emit('participantConnected', 'newParticipant@HearingOfficer');
    });
    expect(result.current).toEqual(false);
    expect(onmsg).toBeCalledWith(NOTIFICATION_MESSAGE.WAITING_FOR_REPORTER);
  });

  it('should return true when "participantConnected" is the host', async () => {
    const { result } = renderHook(useIsHosetIn(onmsg));
    act(() => {
      mockRoom.emit('participantConnected', 'newParticipant@HearingOfficer');
      mockRoom.emit('participantConnected', 'newParticipant@Reporter');
    });
    expect(result.current).toEqual(true);
    expect(onmsg).toBeCalledWith(NOTIFICATION_MESSAGE.WAITING_FOR_REPORTER);
    expect(onmsg).toBeCalledWith(NOTIFICATION_MESSAGE.REPORTER_HAS_JOINED);
    expect(onmsg).toBeCalledTimes(2);
  });

  it('should return false after host had left', async () => {
    const { result } = renderHook(useIsHosetIn(onmsg));
    act(() => {
      mockRoom.emit('participantConnected', 'newParticipant@HearingOfficer');
      mockRoom.emit('participantConnected', 'newParticipant@Reporter');
      mockRoom.emit('participantDisconnected', 'newParticipant@Reporter');
    });
    expect(result.current).toEqual(false);
    expect(onmsg).toBeCalledWith(NOTIFICATION_MESSAGE.WAITING_FOR_REPORTER);
    expect(onmsg).toBeCalledWith(NOTIFICATION_MESSAGE.REPORTER_HAS_JOINED);
    expect(onmsg).toBeCalledWith(NOTIFICATION_MESSAGE.WAITING_FOR_REPORTER);
    expect(onmsg).toBeCalledTimes(3);
  });

  it('should return true after host had left and there is another host in the room', async () => {
    const { result } = renderHook(useIsHosetIn(onmsg));
    act(() => {
      mockRoom.emit('participantConnected', 'newParticipant@HearingOfficer');
      mockRoom.emit('participantConnected', 'newParticipant@Reporter');
      mockRoom.emit('participantConnected', 'newParticipant1@Reporter');
      mockRoom.emit('participantDisconnected', 'newParticipant@Reporter');
    });
    expect(result.current).toEqual(true);
    expect(onmsg).toBeCalledWith(NOTIFICATION_MESSAGE.WAITING_FOR_REPORTER);
    expect(onmsg).toBeCalledWith(NOTIFICATION_MESSAGE.REPORTER_HAS_JOINED);
    expect(onmsg).toBeCalledTimes(3);
  });
});
