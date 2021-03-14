import { Participant } from 'twilio-video';
import { ParticipantIdentity } from './participantIdentity';
import { PARTICIPANT_TYPES } from './rbac/ParticipantTypes';

const sortParticipants = (unsorted: Participant[]) => {
  if (unsorted.length === 0) return [];

  let bank = [...unsorted];

  // Put the desired order in this array
  const priorities = [
    PARTICIPANT_TYPES.REPORTER,
    PARTICIPANT_TYPES.HEARING_OFFICER,
    PARTICIPANT_TYPES.PARENT_REPRESENTATIVE,
    PARTICIPANT_TYPES.INTERPRETER,
  ];

  let sorted: Participant[] = [];
  priorities.map(type => {
    bank = bank.filter(participant => {
      if (!participant.identity) return true;
      const { partyType } = ParticipantIdentity.Parse(participant.identity);
      if (partyType === type) {
        sorted.push(participant);
        return false;
      }
      return true;
    });
  });

  // Add the rest of the participants unsorted
  sorted = [...sorted, ...bank];
  return sorted;
};

export default sortParticipants;
