import express from "express";
import { IChat, IParticipant, IRoomSettings } from "./types";

interface IGetRoomResponse {
  roomId: string;
  roomName: string;
  participants: IParticipant[];
  chat: IChat;
  plannedStartTime: Date;
  startTime: Date;
  parentRoomId?: string;
  roomSettings: IRoomSettings;
  dialInNumber?: string;
};

const getRoom = async (req:express.Request,res:express.Response) => {

  const mockResponse:IGetRoomResponse = {
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
    dialInNumber: "+972502853077"
  }

  return res.send(mockResponse);
}

export default getRoom;