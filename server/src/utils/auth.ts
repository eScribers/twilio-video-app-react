
type Token = string;
interface IDecodedToken {
  personId: number;
};

export const decodeToken = (token:Token) => {
  // Todo implement tokens parsing
  console.log("Currently we're not using the tokens on decodeToken");
  
  return {
    personId: 1,
  } as IDecodedToken
}

interface IObjectKeys {
  [key: string]: string | number | undefined;
}

export interface IParticipantInfo extends IObjectKeys {
    partyType: string,
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