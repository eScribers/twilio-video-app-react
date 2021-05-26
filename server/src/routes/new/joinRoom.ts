import express from "express";

interface IGetRoomRequestData {
  roomId: string;
  displayName: string;
}

interface IGetRoomResponse {
  roomId:string;
  roomName:string;
};


// Will allow us to join side-rooms, we can unify that to getRoom basically
const joinRoom = async (req: express.Request, res: express.Response) => {

  // We should use the JWT in the authentication header to get the user's name
  const reqData: IGetRoomRequestData = {
    roomId: 'f2o3kvk929kdjv943fkabm9ra39akd3akf', // From auth header
    displayName: 'Gal Zakay', // From auth header
  };
  console.log(reqData);

  const mockResponse: IGetRoomResponse = {
    roomId: 'f2o3kvk929kdjv943fkabm9ra39akd3akf',
    roomName: 'Hearing 101'
  }

  return res.send(mockResponse);
}

export default joinRoom;