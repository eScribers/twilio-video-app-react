import { Participant } from 'twilio-video';
import { ParticipantIdentity } from './participantIdentity';
import { PARTICIPANT_TYPES } from './rbac/ParticipantTypes';
import { orderBy } from 'lodash';

const defaultPriorities = [
  PARTICIPANT_TYPES.REPORTER,
  PARTICIPANT_TYPES.HEARING_OFFICER,
  PARTICIPANT_TYPES.PARENT_REPRESENTATIVE,
  PARTICIPANT_TYPES.INTERPRETER,
];

const sortParticipants = (unsorted: Participant[], priorities: string[] = defaultPriorities) => {
  if (unsorted.length === 0) return [];

  let bank = [...unsorted];

  let sorted: Participant[] = [];
  // eslint-disable-next-line
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

  // Sort the rest of the participants alphabetically (ASC)
  bank = orderBy(bank, ['identity']);

  // Add the rest of the participants unsorted
  sorted = [...sorted, ...bank];
  return sorted;
};

export default sortParticipants;
