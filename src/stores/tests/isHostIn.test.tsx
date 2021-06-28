import { act } from '@testing-library/react-hooks';
import { RootStore } from '../makeStore';
import { mockParticipant } from '../../utils/mocks';

describe('the useIsHostIn hook', () => {
  let roomStore: any;
  let participantStore: any;

  beforeEach(() => {
    const rootStore = new RootStore();
    roomStore = rootStore.roomStore;
    participantStore = rootStore.participantStore;
  });

  it('when there are no participants yet should return true', () => {
    act(() => {
      participantStore.setParticipant(new mockParticipant());
    });
    expect(participantStore.isHostIn).toEqual(true);
  });

  it('should return false when "participantConnected" is not the host', async () => {
    act(() => {
      roomStore.room.state = 'connected';
      participantStore.addParticipant(new mockParticipant('newParticipant@Parent'));
    });
    expect(participantStore.isHostIn).toEqual(false);
  });

  it('should return true when "participantConnected" is the host', async () => {
    act(() => {
      participantStore.addParticipant(new mockParticipant('newParticipant@Hearing Officer'));
      participantStore.addParticipant(new mockParticipant('newParticipant@Reporter'));
    });
    expect(participantStore.isHostIn).toEqual(true);
  });

  it('should return false after host had left', async () => {
    const reporter = new mockParticipant('newParticipant@Reporter');
    act(() => {
      roomStore.room.state = 'connected';
      participantStore.addParticipant(reporter);
      participantStore.addParticipant(new mockParticipant('newParticipant@Parent'));
      participantStore.removeParticipantSid(reporter.sid);
    });
    expect(participantStore.isHostIn).toEqual(false);
  });

  it('should return true after host had left and there is another host in the room', async () => {
    const reporter = new mockParticipant('newParticipant@Reporter');
    act(() => {
      roomStore.room.state = 'connected';
      participantStore.addParticipant(new mockParticipant('newParticipant@Hearing Officer'));
      participantStore.addParticipant(reporter);
      participantStore.addParticipant(new mockParticipant('newParticipant1@Reporter'));
      participantStore.removeParticipantSid(reporter.sid);
    });
    expect(participantStore.isHostIn).toEqual(true);
  });
});
