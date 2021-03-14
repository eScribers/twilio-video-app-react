import { Participant } from 'twilio-video';
import { PARTICIPANT_TYPES } from './rbac/ParticipantTypes';
import sortParticipants from './sortParticipants';

describe('Sorting participants', () => {
  it('sort participants by role', () => {
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
  it('sort participants by role and alphabetic order', () => {
    const participants: Participant[] = [
      { identity: 'Hearing officer@' + PARTICIPANT_TYPES.HEARING_OFFICER },
      { identity: 'Cc Ba@' + PARTICIPANT_TYPES.PARENT },
      { identity: 'Cc Aa@' + PARTICIPANT_TYPES.PARENT },
      { identity: 'Dd Dd@' + PARTICIPANT_TYPES.PARENT },
      { identity: 'Aa Aa@' + PARTICIPANT_TYPES.PARENT },
      { identity: 'Bb Aa@' + PARTICIPANT_TYPES.PARENT },
    ] as any[];
    const sorted = sortParticipants(participants);
    expect(sorted[0].identity).toBe('Hearing officer@' + PARTICIPANT_TYPES.HEARING_OFFICER);
    expect(sorted[1].identity).toBe('Aa Aa@' + PARTICIPANT_TYPES.PARENT);
    expect(sorted[2].identity).toBe('Bb Aa@' + PARTICIPANT_TYPES.PARENT);
    expect(sorted[3].identity).toBe('Cc Aa@' + PARTICIPANT_TYPES.PARENT);
    expect(sorted[4].identity).toBe('Cc Ba@' + PARTICIPANT_TYPES.PARENT);
    expect(sorted[5].identity).toBe('Dd Dd@' + PARTICIPANT_TYPES.PARENT);
  });
});
