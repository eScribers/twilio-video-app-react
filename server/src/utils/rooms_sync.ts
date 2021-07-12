import { SyncClient, SyncList } from "twilio-sync";
import { twilioClient, TwilioToken } from './twilio_client';

interface Rooms {
  [key: string]:RoomManagement
}

export let rooms:Rooms = {};

// TODO implement DB
export const getSyncListId = (roomIdentifier:string) => {
  if(roomIdentifier === '14') return 'ES929ee6cc278f4cae8d6a450a4aa17eb2';
  return '!!!No list Sid is available!!!';
}

export const getRoomIdentifierByRoomSid = (roomSid:string) => {
  return "14";
}

class RoomManagement {
  roomIdentifier: string = '';
  status: 'connected' | 'connecting' | 'disconnected' = 'disconnected';
  list?: SyncList;
  constructor(roomIdentifier:string) {
    this.roomIdentifier = roomIdentifier;
    (async () => {
      if(this.status === 'connected') return;
      this.status = 'connecting';

      try {
        const token = await TwilioToken('server', this.roomIdentifier);

        // Get the room here, intercept events (user joined, left etc) and create events for each type
        // Then post these events to the sync

        const syncClient = new SyncClient(token);
        this.list = await syncClient.list(getSyncListId(this.roomIdentifier));
        this.list.on('itemAdded', (event) => {
          const {data} = event.item.descriptor;
          console.log("Got item!", data);
        });
        
        this.status = 'connected';

        // Listening to room events
        const room = await twilioClient.video.rooms(this.roomIdentifier).fetch();
        // room.on('participantConnected', console.log)
      } catch (err) {
        this.status = 'disconnected';
      }
    })()
  }
}

export default RoomManagement;