import express from "express";
import { IRoom } from "./types";

interface IGetRoomRequestData {
  customerId: string;
  roomName: string;
  plannedStartTime: Date;
  allowStartMargin: {
    before: number;
    after: number;
  };
}


const getRoom = async (req: express.Request, res: express.Response) => {

  // That can be in JWT to validate integrity, TABula should provide that data
  const reqData: IGetRoomRequestData = {
    customerId: 'd11kvk929kdjv943fkabm9ra3919fj9ck', // Represents TABula, this should notify about events (recordings, join, leave etc)
    roomName: 'Hearing 101',
    plannedStartTime: new Date(),
    allowStartMargin: { 
      before: 15, 
      after: 45 
    },
  };
  console.log(reqData);

  const mockResponse: IRoom = {
    roomId: 'f2o3kvk929kdjv943fkabm9ra39akd3akf',
    roomName: 'Hearing 101',
    plannedStartTime: new Date(),
    startTime: new Date(),
    participants: [],
    chat: {
      messages: []
    },
    roomSettings: {
      chat: true,
    },
    dialInNumber: "+972502853077",
    cloudRecording: false,
  }

  // Notify customerId that the room was created

  // After returning:
  // Register client to Twilio Sync so he can recieve updates on the state (participants, chat, etc)
  // Allow him to connect to the room with camera and audio OFF, until he wants in the room
  //

  return res.send(mockResponse);
}

export default getRoom;