import express from "express";

interface IUnmuteParticipantRequest {
  roomId: string;
  participantId: string;
}

const requestUnmuteParticipant = async (req: express.Request, res: express.Response) => {

  // Get the sender permissions via auth header, check the JWT integrity
  // Log event in the chat

  const reqData:IUnmuteParticipantRequest = {
    roomId: 'f2o3kvk929kdjv943fkabm9ra39akd3akf',
    participantId: '1kf9vk929kdjv943fkabm9ra39a30922g'
  };

  return res.send("OK")
}

export default requestUnmuteParticipant;