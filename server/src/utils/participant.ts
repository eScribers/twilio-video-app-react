
import { IParticipantInfo } from './auth'
export const GetIdentityString = ({ partyName, partyType, personId, userId }: IParticipantInfo) => {
  if (partyName == null) throw new Error('partyName is null');
  if (partyType == null) throw new Error('partyType is null');
  let participantIdentityString = `${partyName}@${partyType}`;
  if (personId != null) {
    participantIdentityString += `@${personId}`;
    if (userId != null)
      participantIdentityString += `@${userId}`;
  }
  return participantIdentityString;
}
