import { act } from '@testing-library/react-hooks';
import { RootStore } from '../../stores/makeStore';

describe('the useRoomState hook', () => {
  let rootStore = new RootStore();
  let unmountRoom: (() => void) | undefined = () => {};
  beforeEach(() => {
    unmountRoom && unmountRoom();
    jest.mock('../../stores', () => {
      return {
        __esModule: true, // this property makes it work
        default: rootStore,
      };
    });
    let newStore = new RootStore();
    rootStore.participantsStore = newStore.participantsStore;
    rootStore.roomsStore = newStore.roomsStore;
  });

  it('should return "disconnected" by default', () => {
    expect(rootStore.roomsStore.currentRoom.state).toBe(undefined);
  });

  it('should return "connected" if the room state is connected', async () => {
    await act(async () => {
      unmountRoom = await rootStore.roomsStore.joinRoom('');
      rootStore.roomsStore.currentRoom.state = 'connected';
    });
    expect(rootStore.roomsStore.currentRoom.state).toBe('connected');
  });

  it('should respond to the rooms "reconnecting" event', async () => {
    await act(async () => {
      unmountRoom = await rootStore.roomsStore.joinRoom('');
      rootStore.roomsStore.currentRoom.state = 'reconnecting';
      rootStore.roomsStore.currentRoom.emit('reconnecting');
    });
    expect(rootStore.roomsStore.currentRoom.state).toBe('reconnecting');
  });

  it('should respond to the rooms "reconnected" event', async () => {
    await act(async () => {
      unmountRoom = await rootStore.roomsStore.joinRoom('');
      rootStore.roomsStore.currentRoom.state = 'connected';
      rootStore.roomsStore.currentRoom.emit('reconnected');
    });
    expect(rootStore.roomsStore.currentRoom.state).toBe('connected');
  });

  it('should respond to the rooms "disconnected" event', async () => {
    await act(async () => {
      unmountRoom = await rootStore.roomsStore.joinRoom('');
      rootStore.roomsStore.currentRoom.state = 'disconnected';
      rootStore.roomsStore.currentRoom.emit('disconnected');
    });
    expect(rootStore.roomsStore.currentRoom.state).toBe('disconnected');
  });

  it('tear down old listeners when receiving a new room', async () => {
    rootStore = require('../../stores').default;
    await act(async () => {
      unmountRoom = await rootStore.roomsStore.joinRoom('');
    });

    expect(rootStore.roomsStore.currentRoom.listenerCount('disconnected')).toBe(1);
    expect(rootStore.roomsStore.currentRoom.listenerCount('reconnected')).toBe(1);
    expect(rootStore.roomsStore.currentRoom.listenerCount('reconnecting')).toBe(1);

    act(() => {
      unmountRoom && unmountRoom();
    });

    expect(rootStore.roomsStore.currentRoom.listenerCount('disconnected')).toBe(0);
    expect(rootStore.roomsStore.currentRoom.listenerCount('reconnected')).toBe(0);
    expect(rootStore.roomsStore.currentRoom.listenerCount('reconnecting')).toBe(0);
  });
});
