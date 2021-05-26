import express from "express";

interface IRemoveParticipantRequest {
  roomId: string;
  participantId: string;
  reason: string;
}

const removeParticipant = async (req: express.Request, res: express.Response) => {

  // Get the sender permissions via auth header, check the JWT integrity
  // Notify everybody that the participant has been removed via Twilio Sync
  // Log event in the chat

  const reqData:IRemoveParticipantRequest = {
    roomId: 'f2o3kvk929kdjv943fkabm9ra39akd3akf',
    participantId: '1kf9vk929kdjv943fkabm9ra39a30922g',
    reason: 'The hearing officer has requested that you leave the room',
  };

  return res.send("OK");
}

export default removeParticipant;