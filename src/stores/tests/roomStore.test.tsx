import EventEmitter from 'events';
import { RootStore } from '../makeStore';
import Video from 'twilio-video';
import { act } from '@testing-library/react';
import { sleep } from '../../utils';
import * as utils from '../../utils';

describe('the room store', () => {
  it('should return an empty room when no token is provided', () => {
    const rootStore = new RootStore();

    expect(rootStore.roomsStore.room).toEqual(new EventEmitter());
  });

  it('should create a room', async () => {
    const { roomsStore } = new RootStore();
    jest.spyOn(roomsStore, 'setIsConnecting');
    jest.spyOn(Video, 'connect');
    expect(roomsStore.isConnecting).toBe(false);
    await act(async () => {
      await roomsStore.joinRoom('token');
    });
    expect(roomsStore.setIsConnecting).toHaveBeenCalledWith(true);
    expect(Video.connect).toHaveBeenCalledTimes(1);
    expect(roomsStore.room.disconnect).not.toHaveBeenCalled();
    expect(roomsStore.isConnecting).toBe(false);
  });

  it('should set the priority of video tracks to low', async () => {
    const { roomsStore, participantsStore } = new RootStore();

    await act(async () => {
      await roomsStore.joinRoom('token');
    });
    expect(participantsStore.localParticipant?.participant?.videoTracks[0].setPriority).toHaveBeenCalledWith('low');
  });

  it('should return a room after connecting to a room', async () => {
    const { roomsStore } = new RootStore();
    await act(async () => {
      await roomsStore.joinRoom('token');
    });
    expect(roomsStore.room.state).toEqual('connected');
  });

  it('should add a listener for the "beforeUnload" event when connected to a room', async () => {
    jest.spyOn(window, 'addEventListener');
    const { roomsStore } = new RootStore();
    await act(async () => {
      await roomsStore.joinRoom('token');
    });
    expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });

  it('should remove the listener for the "beforeUnload" event when the room is disconnected', async () => {
    jest.spyOn(window, 'removeEventListener');
    const { roomsStore } = new RootStore();
    await act(async () => {
      await roomsStore.joinRoom('token');
    });
    roomsStore.room.emit('disconnected');
    expect(window.removeEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });

  it('should call onError and set isConnecting to false when there is an error', async () => {
    const mockVideoConnect = Video.connect as jest.Mock<any>;
    mockVideoConnect.mockImplementationOnce(() => Promise.reject(new Error('mockError')));
    const { roomsStore } = new RootStore();
    jest.spyOn(roomsStore, 'setError');
    await act(async () => {
      await roomsStore.joinRoom('token');
    });
    expect(roomsStore.setError).toHaveBeenLastCalledWith('mockError');
    expect(roomsStore.isConnecting).toBe(false);
  });

  it('should reset the room object on disconnect', async () => {
    const { roomsStore } = new RootStore();
    await act(async () => {
      await roomsStore.joinRoom('token');
    });

    expect(roomsStore.room.state).toBe('connected');
    roomsStore.room.emit('disconnected');
    await sleep(50);
    expect(roomsStore.room.state).toBe(undefined);
  });

  describe('when isMobile is true', () => {
    // @ts-ignore
    utils.isMobile = true;

    it('should add a listener for the "pagehide" event when connected to a room', async () => {
      jest.spyOn(window, 'addEventListener');
      const { roomsStore } = new RootStore();
      await act(async () => {
        await roomsStore.joinRoom('token');
      });
      expect(window.addEventListener).toHaveBeenCalledWith('pagehide', expect.any(Function));
    });

    it('should remove the listener for the "pagehide" event when the room is disconnected', async () => {
      jest.spyOn(window, 'removeEventListener');
      const { roomsStore } = new RootStore();
      await act(async () => {
        await roomsStore.joinRoom('token');
      });
      await sleep(50);
      roomsStore.room.emit('disconnected');
      expect(window.removeEventListener).toHaveBeenCalledWith('pagehide', expect.any(Function));
    });
  });
});
