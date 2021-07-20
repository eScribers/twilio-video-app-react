import { act } from '@testing-library/react-hooks';
import { RootStore } from '../makeStore';
import { mockParticipant } from '../../utils/mocks';
import { ROOM_STATE } from '../../utils/displayStrings';

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
      participantsStore.localParticipant?.setParticipant(new mockParticipant('remote', 'Reporter', 2));
    });
    expect(participantsStore.isHostIn).toEqual(true);
  });

  it('should return false when "participantConnected" is not the host', async () => {
    act(() => {
      roomsStore.currentRoom.state = ROOM_STATE.CONNECTED;
      participantsStore.addParticipant(new mockParticipant('newParticipant', 'Parent', 1));
    });
    expect(participantsStore.isHostIn).toEqual(false);
  });

  it('should return true when "participantConnected" is the host', async () => {
    act(() => {
      participantsStore.addParticipant(new mockParticipant('newParticipant', 'Hearing Officer', 1));
      participantsStore.addParticipant(new mockParticipant('newParticipant', 'Reporter', 2));
    });
    expect(participantsStore.isHostIn).toEqual(true);
  });

  it('should return false after host had left', async () => {
    const reporter = new mockParticipant('newParticipant@Reporter');
    act(() => {
      roomsStore.currentRoom.state = ROOM_STATE.CONNECTED;
      participantsStore.addParticipant(reporter);
      participantsStore.addParticipant(new mockParticipant('newParticipant', 'Parent', 2));
      participantsStore.removeParticipantSid(reporter.sid);
    });
    expect(participantsStore.isHostIn).toEqual(false);
  });

  it('should return true after host had left and there is another host in the room', async () => {
    const reporter = new mockParticipant('newParticipant@Reporter');
    act(() => {
      roomsStore.currentRoom.state = ROOM_STATE.CONNECTED;
      participantsStore.addParticipant(new mockParticipant('newParticipant', 'Hearing Officer', 1));
      participantsStore.addParticipant(reporter);
      participantsStore.addParticipant(new mockParticipant('newParticipant1', 'Reporter', 2));
      participantsStore.removeParticipantSid(reporter.sid);
    });
    expect(participantsStore.isHostIn).toEqual(true);
  });
});
