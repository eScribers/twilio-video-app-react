import { getSyncListId } from "../../utils/rooms_sync";

const authoriseParticipant = (_req: any, res: any) => {

  const type = Math.floor(Math.random()*3);
  let participantRole = 'Hearing Officer';
  if(type === 1) participantRole = 'Reporter';
  if(type === 2) participantRole = 'Parent';
  res.send(
    {
      "participantInfo": {
        "displayName": "Gal Zakay " + participantRole,
        "caseReference": 14,
        "videoConferenceRoomName": "14",
        "syncListSid": getSyncListId('14'),
        "role": participantRole,
        "personId": 59
      }
    })
};

export default authoriseParticipant;