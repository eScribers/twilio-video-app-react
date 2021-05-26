import express from "express";

interface IMuteParticipantRequest {
  roomId: string;
  participantId: string;
}

const muteParticipant = async (req: express.Request, res: express.Response) => {

  // Get the sender permissions via auth header, check the JWT integrity
  // Notify everybody that the participant has been muted via Twilio Sync
  // Log event in the chat

  const reqData:IMuteParticipantRequest = {
    roomId: 'f2o3kvk929kdjv943fkabm9ra39akd3akf',
    participantId: '1kf9vk929kdjv943fkabm9ra39a30922g'
  };

  return res.send("OK")
}

export default muteParticipant;