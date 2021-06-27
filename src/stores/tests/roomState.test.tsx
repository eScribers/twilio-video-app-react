import { RootStore } from '../../stores/makeStore';
import { act } from '@testing-library/react-hooks';

describe('the useRoomState hook', () => {
  let rootStore;
  let unmountRoom: (() => void) | undefined = () => {};
  beforeEach(() => {
    unmountRoom && unmountRoom();
    jest.resetModules();
    jest.mock('../../stores', () => {
      return {
        __esModule: true, // this property makes it work
        default: new RootStore(),
      };
    });
    rootStore = require('../../stores').default;
  });

  it('should return "disconnected" by default', () => {
    expect(rootStore.roomStore.room.state).toBe(undefined);
  });

  it('should return "connected" if the room state is connected', async () => {
    await act(async () => {
      unmountRoom = await rootStore.roomStore.joinRoom('');
      rootStore.roomStore.room.state = 'connected';
    });
    expect(rootStore.roomStore.room.state).toBe('connected');
  });

  it('should respond to the rooms "reconnecting" event', async () => {
    await act(async () => {
      unmountRoom = await rootStore.roomStore.joinRoom('');
      rootStore.roomStore.room.state = 'reconnecting';
      rootStore.roomStore.room.emit('reconnecting');
    });
    expect(rootStore.roomStore.room.state).toBe('reconnecting');
  });

  it('should respond to the rooms "reconnected" event', async () => {
    await act(async () => {
      unmountRoom = await rootStore.roomStore.joinRoom('');
      rootStore.roomStore.room.state = 'connected';
      rootStore.roomStore.room.emit('reconnected');
    });
    expect(rootStore.roomStore.room.state).toBe('connected');
  });

  it('should respond to the rooms "disconnected" event', async () => {
    await act(async () => {
      unmountRoom = await rootStore.roomStore.joinRoom('');
      rootStore.roomStore.room.state = 'disconnected';
      rootStore.roomStore.room.emit('disconnected');
    });
    expect(rootStore.roomStore.room.state).toBe('disconnected');
  });

  it('tear down old listeners when receiving a new room', async () => {
    rootStore = require('../../stores').default;
    await act(async () => {
      unmountRoom = await rootStore.roomStore.joinRoom('');
    });

    expect(rootStore.roomStore.room.listenerCount('disconnected')).toBe(1);
    expect(rootStore.roomStore.room.listenerCount('reconnected')).toBe(1);
    expect(rootStore.roomStore.room.listenerCount('reconnecting')).toBe(1);

    act(() => {
      unmountRoom && unmountRoom();
    });

    expect(rootStore.roomStore.room.listenerCount('disconnected')).toBe(0);
    expect(rootStore.roomStore.room.listenerCount('reconnected')).toBe(0);
    expect(rootStore.roomStore.room.listenerCount('reconnecting')).toBe(0);
  });
});
