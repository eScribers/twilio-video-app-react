import { act } from '@testing-library/react-hooks';
import { RootStore } from '../makeStore';
import { mockParticipant } from '../../utils/mocks';

describe('the useIsHostIn hook', () => {
  let roomsStore: any;
  let participantsStore: any;

  beforeEach(() => {
    const rootStore = new RootStore();
    roomsStore = rootStore.roomsStore;
    participantsStore = rootStore.participantsStore;
  });

  it('when there are no participants yet should return true', () => {
    act(() => {
      participantsStore.localParticipant?.setParticipant(new mockParticipant());
    });
    expect(participantsStore.isHostIn).toEqual(true);
  });

  it('should return false when "participantConnected" is not the host', async () => {
    act(() => {
      roomsStore.room.state = 'connected';
      participantsStore.addParticipant(new mockParticipant('newParticipant@Parent'));
    });
    expect(participantsStore.isHostIn).toEqual(false);
  });

  it('should return true when "participantConnected" is the host', async () => {
    act(() => {
      participantsStore.addParticipant(new mockParticipant('newParticipant@Hearing Officer'));
      participantsStore.addParticipant(new mockParticipant('newParticipant@Reporter'));
    });
    expect(participantsStore.isHostIn).toEqual(true);
  });

  it('should return false after host had left', async () => {
    const reporter = new mockParticipant('newParticipant@Reporter');
    act(() => {
      roomsStore.room.state = 'connected';
      participantsStore.addParticipant(reporter);
      participantsStore.addParticipant(new mockParticipant('newParticipant@Parent'));
      participantsStore.removeParticipantSid(reporter.sid);
    });
    expect(participantsStore.isHostIn).toEqual(false);
  });

  it('should return true after host had left and there is another host in the room', async () => {
    const reporter = new mockParticipant('newParticipant@Reporter');
    act(() => {
      roomsStore.room.state = 'connected';
      participantsStore.addParticipant(new mockParticipant('newParticipant@Hearing Officer'));
      participantsStore.addParticipant(reporter);
      participantsStore.addParticipant(new mockParticipant('newParticipant1@Reporter'));
      participantsStore.removeParticipantSid(reporter.sid);
    });
    expect(participantsStore.isHostIn).toEqual(true);
  });
});
