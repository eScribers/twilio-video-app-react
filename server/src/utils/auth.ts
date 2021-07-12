import {Request, Response, NextFunction} from "express";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config.json';

type Token = string;
interface IDecodedToken {
  personId: string;
  "role": string,
  "partyName": string,
  "caseReference": string,
  "syncListSid": string,
  "videoConferenceRoomName": string,
  "roomSid": string,
  "twilioToken": string;
};

export const decodeToken = (token:Token) => {
  const decoded = jwt.verify(token, JWT_SECRET) as IDecodedToken;
  return decoded;
}

interface IObjectKeys {
  [key: string]: string | number | undefined;
}

export interface IParticipantInfo extends IObjectKeys {
    role: string,
    partyName: string,
    caseReference: number,
    videoConferenceRoomName: string,
    personId: number,
    userId: number
  };
export const getParticipantInfo = (data:string) => {
  try {
    return JSON.parse(data) as IParticipantInfo;
  } catch (e) {
    console.error('Bad data provided to getParticipantInfo', e);
    throw new Error('Wrong data provided');
  }
}

declare global {
  namespace Express {
    interface Request {
      user: object
    }
  }
}

export const authorizeUser = (authWhitelist:string[]) => (req:Request, res: Response, next:NextFunction) => {
  if(authWhitelist.map(v => `/dev/${v}`).includes(req.originalUrl)) return next();
  try {
    const {authorization} = req.headers;
    if(!authorization) throw new Error("No authorization header recieved");
    const token = authorization.split(' ')[1];
    if(!token.length) throw new Error("No token recieved");

    const decoded = decodeToken(token);
    req.user = decoded;
    next()
  } catch (err) {
    res.status(401).send({error: `No authentication: ${err.message}`});
  }
}