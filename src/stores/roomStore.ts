import { makeAutoObservable } from 'mobx';
import { ROOM_STATE, IRoomState } from '../utils/displayStrings';
import { Room } from 'twilio-video';

class RoomStore {
  rootStore: any;

  room: Room | null = null;

  constructor(rootStore: any) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setRoom(room: Room) {
    this.room = room;
  }

  get roomState() {
    return this.room?.state || ROOM_STATE.DISCONNECTED;
  }
}

export default RoomStore;
