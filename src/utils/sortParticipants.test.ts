import { Participant } from 'twilio-video';
import { PARTICIPANT_TYPES } from './rbac/ParticipantTypes';
import sortParticipants from './sortParticipants';

describe('Sort participants by partyType', () => {
  it('should recursively remove any object keys with a value of undefined', () => {
    const participants: Participant[] = [
      { identity: 'Hearing officer@' + PARTICIPANT_TYPES.HEARING_OFFICER },
      { identity: 'Parent@' + PARTICIPANT_TYPES.PARENT },
      { identity: 'Reporter@' + PARTICIPANT_TYPES.REPORTER },
    ] as any[];
    const sorted = sortParticipants(participants);
    expect(sorted[0].identity).toBe('Reporter@' + PARTICIPANT_TYPES.REPORTER);
    expect(sorted[1].identity).toBe('Hearing officer@' + PARTICIPANT_TYPES.HEARING_OFFICER);
    expect(sorted[2].identity).toBe('Parent@' + PARTICIPANT_TYPES.PARENT);
  });
});
