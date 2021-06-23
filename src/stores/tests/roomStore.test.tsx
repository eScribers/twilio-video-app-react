import EventEmitter from 'events';
import { RootStore } from '../makeStore';
import Video from 'twilio-video';
import { act } from '@testing-library/react';
import { sleep } from '../../utils';
import * as utils from '../../utils';

describe('the room store', () => {
  it('should return an empty room when no token is provided', () => {
    const rootStore = new RootStore();

    expect(rootStore.roomStore.room).toEqual(new EventEmitter());
  });

  it('should create a room', async () => {
    const { roomStore } = new RootStore();
    jest.spyOn(roomStore, 'setIsConnecting');
    jest.spyOn(Video, 'connect');
    expect(roomStore.isConnecting).toBe(false);
    await act(async () => {
      await roomStore.joinRoom('token');
    });
    expect(roomStore.setIsConnecting).toHaveBeenCalledWith(true);
    expect(Video.connect).toHaveBeenCalledTimes(1);
    expect(roomStore.room.disconnect).not.toHaveBeenCalled();
    expect(roomStore.isConnecting).toBe(false);
  });

  it('should set the priority of video tracks to low', async () => {
    const { roomStore, participantStore } = new RootStore();

    await act(async () => {
      await roomStore.joinRoom('token');
    });
    expect(participantStore.participant?.videoTracks[0].setPriority).toHaveBeenCalledWith('low');
  });

  it('should return a room after connecting to a room', async () => {
    const { roomStore } = new RootStore();
    await act(async () => {
      await roomStore.joinRoom('token');
    });
    expect(roomStore.room.state).toEqual('connected');
  });

  it('should add a listener for the "beforeUnload" event when connected to a room', async () => {
    jest.spyOn(window, 'addEventListener');
    const { roomStore } = new RootStore();
    await act(async () => {
      await roomStore.joinRoom('token');
    });
    expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });

  it('should remove the listener for the "beforeUnload" event when the room is disconnected', async () => {
    jest.spyOn(window, 'removeEventListener');
    const { roomStore } = new RootStore();
    await act(async () => {
      await roomStore.joinRoom('token');
    });
    roomStore.room.emit('disconnected');
    expect(window.removeEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });

  it('should call onError and set isConnecting to false when there is an error', async () => {
    const mockOnError = jest.fn();
    const mockVideoConnect = Video.connect as jest.Mock<any>;
    mockVideoConnect.mockImplementationOnce(() => Promise.reject('mockError'));
    const { roomStore } = new RootStore();
    await act(async () => {
      await roomStore.joinRoom('token', {}, mockOnError);
    });
    expect(mockOnError).toHaveBeenCalledWith('mockError');
    expect(roomStore.isConnecting).toBe(false);
  });

  it('should reset the room object on disconnect', async () => {
    const { roomStore } = new RootStore();
    await act(async () => {
      await roomStore.joinRoom('token');
    });

    expect(roomStore.room.state).toBe('connected');
    roomStore.room.emit('disconnected');
    await sleep(50);
    expect(roomStore.room.state).toBe(undefined);
  });

  describe('when isMobile is true', () => {
    // @ts-ignore
    utils.isMobile = true;

    it('should add a listener for the "pagehide" event when connected to a room', async () => {
      jest.spyOn(window, 'addEventListener');
      const { roomStore } = new RootStore();
      await act(async () => {
        await roomStore.joinRoom('token');
      });
      expect(window.addEventListener).toHaveBeenCalledWith('pagehide', expect.any(Function));
    });

    it('should remove the listener for the "pagehide" event when the room is disconnected', async () => {
      jest.spyOn(window, 'removeEventListener');
      const { roomStore } = new RootStore();
      await act(async () => {
        await roomStore.joinRoom('token');
      });
      await sleep(50);
      roomStore.room.emit('disconnected');
      expect(window.removeEventListener).toHaveBeenCalledWith('pagehide', expect.any(Function));
    });
  });
});
