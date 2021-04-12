import * as jwt from 'jsonwebtoken';
import { RoomInstance } from 'twilio/lib/rest/video/v1/room';
import { twilioClient } from '../../utils/twilio_client';
import { decodeToken, getParticipantInfo } from "../../utils/auth";
import RoleChecker from "../../utils/roles";
import { GetIdentityString } from "../../utils/participant";
import { ROOM_STATUS_CALLBACK, JWT_SECRET } from '../../../config.json';
import { ROLE_PERMISSIONS } from '../../rbac/role_permissions';
import { TwilioToken } from "../../utils/twilio_client";

const token = async (req:any, res:any) => {
  let { headers, body } = req;

  // TODO remove mock
  headers.Authorization = 'a a';
  const type = Math.floor(Math.random()*3);
  let participantType = 'Hearing Officer';
  if(type === 1) participantType = 'Reporter';
  if(type === 2) participantType = 'Parent';
  body = JSON.stringify({
    partyType: participantType,
    partyName: 'Gal' + Math.floor(Math.random()*100), // In order to not have conflicting names
    caseReference: "14",
    videoConferenceRoomName: "14",
    personId: "591",
    userId: "591"
  })

  if (!headers.Authorization) 
    return res.sendStatus(401);

  // const participantToken = (headers.Authorization as string).split(' ')[1];
  // const decodedParticipantToken = decodeToken(participantToken);
  let user = getParticipantInfo(body);

  if (!RoleChecker.isRoleRecognized(user.partyType)) {
    throw new Error("Role is unrecognized")
  }

  Object.keys(user).forEach(i => {
    user[i] = typeof user[i] === 'string' ? (user[i] as string).trim() : user[i];
    if (i.length === 0) throw new Error(`Invalid data at key ${i}`)
  } )

  const participantIdentity = GetIdentityString(user);

  let room:RoomInstance | null = null;
  try {
    room = await twilioClient.video.rooms(user.videoConferenceRoomName).fetch();
    console.log("room:", room);
  } catch (e) {
    if (e.status == 404) {
      if (RoleChecker.doesRoleHavePermission(user.partyType, ROLE_PERMISSIONS.START_ROOM)) {
        room = await twilioClient.video.rooms.create({
          recordParticipantsOnConnect: true,
          type: 'group',
          uniqueName: user.videoConferenceRoomName,
          statusCallback: ROOM_STATUS_CALLBACK,
        });
        console.log("Created new room!", room?.sid);
        

        if( !room || !room.sid )
          throw new Error("No room sid was received");

        // TODO initiate conference in the DB

      } else {
        return res.send({
            roomExist: false,
            result: 'Room not found for this case number',
          })
      }

    } else {
      console.log('Error while fetching room from twilio.', e);
    }
  }

  try {

    const participant = await twilioClient.video
      .rooms(user.videoConferenceRoomName)
      .participants.get(participantIdentity)
      .fetch();

    if (participant.sid) {
      res.status(409);
      return res.send('Participant with this name already present, please choose a different name.');
    }
  } catch (e) { }

  const twilioToken = TwilioToken(
    participantIdentity,
    user.videoConferenceRoomName
  );

  const token = jwt.sign({
    partyType: user.partyType,
    partyName: user.partyName,
    caseReference: user.caseReference,
    videoConferenceRoomName: user.videoConferenceRoomName,
    roomSid: room?.sid,
    personId: user.personId,
    twilioToken,
  },
    JWT_SECRET || ''
  );
  return res.send({
    roomExist: true,
    result: token,
  });
};

export default token;