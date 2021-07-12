
import { IParticipantInfo } from './auth'
export const GetIdentityString = ({ partyName, role, personId, userId }: IParticipantInfo) => {
  if (partyName == null) throw new Error('partyName is null');
  if (role == null) throw new Error('role is null');
  let participantIdentityString = `${partyName}@${role}`;
  if (personId != null) {
    participantIdentityString += `@${personId}`;
    if (userId != null)
    participantIdentityString += `@${userId}`;
    }
  return participantIdentityString;
}
