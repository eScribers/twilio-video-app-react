import { act } from '@testing-library/react-hooks';
import { RootStore } from '../../stores/makeStore';
import { ROOM_STATE } from '../../utils/displayStrings';

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
      rootStore.roomsStore.currentRoom.state = ROOM_STATE.CONNECTED;
    });
    expect(rootStore.roomsStore.currentRoom.state).toBe(ROOM_STATE.CONNECTED);
  });

  it('should respond to the rooms "reconnecting" event', async () => {
    await act(async () => {
      unmountRoom = await rootStore.roomsStore.joinRoom('');
      rootStore.roomsStore.currentRoom.state = ROOM_STATE.RECONNECTING;
      rootStore.roomsStore.currentRoom.emit(ROOM_STATE.RECONNECTING);
    });
    expect(rootStore.roomsStore.currentRoom.state).toBe(ROOM_STATE.RECONNECTING);
  });

  it('should respond to the rooms "reconnected" event', async () => {
    await act(async () => {
      unmountRoom = await rootStore.roomsStore.joinRoom('');
      rootStore.roomsStore.currentRoom.state = ROOM_STATE.CONNECTED;
      rootStore.roomsStore.currentRoom.emit(ROOM_STATE.RECONNECTED);
    });
    expect(rootStore.roomsStore.currentRoom.state).toBe(ROOM_STATE.CONNECTED);
  });

  it('should respond to the rooms "disconnected" event', async () => {
    await act(async () => {
      unmountRoom = await rootStore.roomsStore.joinRoom('');
      rootStore.roomsStore.currentRoom.state = ROOM_STATE.DISCONNECTED;
      rootStore.roomsStore.currentRoom.emit(ROOM_STATE.DISCONNECTED);
    });
    expect(rootStore.roomsStore.currentRoom.state).toBe(ROOM_STATE.DISCONNECTED);
  });

  it('tear down old listeners when receiving a new room', async () => {
    rootStore = require('../../stores').default;
    await act(async () => {
      unmountRoom = await rootStore.roomsStore.joinRoom('');
    });

    expect(rootStore.roomsStore.currentRoom.listenerCount(ROOM_STATE.DISCONNECTED)).toBe(1);
    expect(rootStore.roomsStore.currentRoom.listenerCount(ROOM_STATE.RECONNECTED)).toBe(1);
    expect(rootStore.roomsStore.currentRoom.listenerCount(ROOM_STATE.RECONNECTING)).toBe(1);

    act(() => {
      unmountRoom && unmountRoom();
    });

    expect(rootStore.roomsStore.currentRoom.listenerCount(ROOM_STATE.DISCONNECTED)).toBe(0);
    expect(rootStore.roomsStore.currentRoom.listenerCount(ROOM_STATE.RECONNECTED)).toBe(0);
    expect(rootStore.roomsStore.currentRoom.listenerCount(ROOM_STATE.RECONNECTING)).toBe(0);
  });
});
