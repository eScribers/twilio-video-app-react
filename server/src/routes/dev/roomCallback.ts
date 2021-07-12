import { createCompositions } from '../../utils/compositions';
import { getRoomIdentifierByRoomSid, rooms } from '../../utils/rooms_sync';

const syncEvent = {
  event: (text:string, user?:string) => ({
      type: 'Event',
      time: new Date(),
      data: {
        text,
        user,
      },
  })
}

const roomCallback = (req: any, res: any) => {
  const { StatusCallbackEvent, RoomSid, ParticipantIdentity } = req.body;
  if(!StatusCallbackEvent) throw new Error('Got roomCallback without StatusCallbackEvent');
  if(!RoomSid) throw new Error('Got roomCallback without RoomSid');
  
  const list = rooms[getRoomIdentifierByRoomSid(RoomSid)].list;
  if(!list) throw new Error('No list available! Check RoomSid + roomIdentifier');


  // https://www.twilio.com/docs/video/api/status-callbacks
  if(StatusCallbackEvent === 'room-created') {
    list.push(syncEvent.event('Room created'));
  } else if(StatusCallbackEvent === 'connected') {
    list.push(syncEvent.event(`${ParticipantIdentity} joined`));
  } else if(StatusCallbackEvent === 'participant-disconnected') {
    list.push(syncEvent.event(`${ParticipantIdentity} left`));
  } else if(StatusCallbackEvent === 'track-added') {
    // const { ParticipantIdentity, TrackKind } = req.body;
  } else if(StatusCallbackEvent === 'recording-started') {
    let kind = 'Audio';
    if(req.body.Container === 'mkv') kind = 'Video';
    list.push(syncEvent.event(`${kind} recording started for ${ParticipantIdentity}`));
  } else if(StatusCallbackEvent === 'recording-completed') {
    let kind = 'Audio';
    if(req.body.Container === 'mkv') kind = 'Video';
    list.push(syncEvent.event(`${kind} recording completed for ${ParticipantIdentity}`));
  } else if(StatusCallbackEvent === 'room-ended') {
    createCompositions(RoomSid);
  } else {
    console.warn('Unhandeled StatusCallbackEvent event: ', StatusCallbackEvent);
  }

  return res.send();
};

export default roomCallback;
