import express from "express";

interface IGetLinkRequestData {
  roomId: string;
  displayName: string;
}

interface IGetLinkResponseData {
  roomId: string;
  displayName: string;
}

// This is just an idea

const getLink = async (req: express.Request, res: express.Response) => {

  // Use auth headers to provide customer token
  const reqData: IGetLinkRequestData = {
    roomId: 'f2o3kvk929kdjv943fkabm9ra39akd3akf',
    displayName: 'Tal Rosenberger',
  };
  console.log(reqData);

  const mockResponse: IGetLinkResponseData = {
    roomId: 'f2o3kvk929kdjv943fkabm9ra39akd3akf',
    displayName: 'Tal Rosenberger',
  }

  // Store access token in the DB

  const link = `https://court-link.escribers.io/join/Ab92LbUsP`

  return res.send(link);
}

export default getLink;