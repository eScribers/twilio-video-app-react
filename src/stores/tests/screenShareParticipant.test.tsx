import { act } from '@testing-library/react-hooks';
import { RootStore } from '../makeStore';
import { mockLocalParticipant, mockParticipant } from '../../utils/mocks';
import { ROOM_STATE } from '../../utils/displayStrings';

function createRootStore() {
  const rootStore = new RootStore();
  const { roomsStore, participantsStore } = rootStore;
  const localParticipant = new mockLocalParticipant('local', 'Reporter', 1);

  participantsStore.localParticipant?.setParticipant(localParticipant);

  roomsStore.currentRoom.state = ROOM_STATE.CONNECTED;
  return rootStore;
}

describe('the useScreenShareParticipant hook', () => {
  let roomsStore, participantsStore;
  beforeEach(() => {
    const rootStore = createRootStore();
    roomsStore = rootStore.roomsStore;
    participantsStore = rootStore.participantsStore;
  });

  it('return undefined when there are no participants sharing their screen', () => {
    expect(participantsStore.screenShareParticipant()).toEqual(undefined);
  });

  it('should return the localParticipant when they are sharing their screen', () => {
    const participant = new mockLocalParticipant('local', 'Reporter', 1);
    participant.tracks = new Map([[0, { trackName: 'screen' }]]);
    participantsStore.localParticipant?.setParticipant(participant);

    expect(participantsStore.screenShareParticipant()).toEqual(participantsStore.localParticipant?.participant);
  });

  it('should return a remoteParticipant when they are sharing their screen', () => {
    const participant = new mockParticipant('remote', 'Reporter', 2);
    participant.tracks = new Map([[0, { trackName: 'screen' }]]);
    participantsStore.addParticipant(participant);
    expect(participantsStore.screenShareParticipant()).toEqual(participant);
  });

  it('should respond to "trackPublished" and "trackUnpublished" events emitted from the localParticipant', () => {
    expect(participantsStore.screenShareParticipant()).toEqual(undefined);

    act(() => {
      participantsStore.localParticipant?.participant.tracks = new Map([[0, { trackName: 'screen' }]]);
      participantsStore.localParticipant?.participant.emit('trackPublished');
    });

    expect(participantsStore.screenShareParticipant()).toEqual(participantsStore.localParticipant?.participant);

    act(() => {
      participantsStore.localParticipant?.participant.tracks = new Map([]);
      participantsStore.localParticipant?.participant.emit('trackUnpublished');
    });

    expect(participantsStore.screenShareParticipant()).toEqual(undefined);
  });

  it('should respond to "trackPublished" and "trackUnpublished" events emitted from the room', () => {
    const participant = new mockParticipant('remote', 'Reporter', 2);
    participant.tracks = new Map([[0, { trackName: 'screen' }]]);

    expect(participantsStore.screenShareParticipant()).toEqual(undefined);

    act(() => {
      participantsStore.addParticipant(participant);
      roomsStore.currentRoom.emit('trackPublished');
    });

    expect(participantsStore.screenShareParticipant()).toEqual(participant);

    act(() => {
      participant.tracks = new Map([]);
      roomsStore.currentRoom.emit('trackUnpublished');
    });

    expect(participantsStore.screenShareParticipant()).toEqual(undefined);
  });

  it('should respond to "participantDisconnected" events emitted from the room', () => {
    const participant = new mockParticipant('remote', 'Reporter', 2);
    participant.tracks = new Map([[0, { trackName: 'screen' }]]);
    participantsStore.addParticipant(participant);

    expect(participantsStore.screenShareParticipant()).toEqual(participant);

    act(() => {
      participantsStore.removeParticipantSid(participant.sid);
      roomsStore.currentRoom.emit('participantDisconnected');
    });

    expect(participantsStore.screenShareParticipant()).toEqual(undefined);
  });

  it('should clean up all listeners when unmounted', async () => {
    let unmount = () => {};
    await act(async () => {
      unmount = await roomsStore.joinRoom();
    });

    expect(roomsStore.currentRoom.listenerCount('participantDisconnected')).toBe(1);
    unmount();
    expect(roomsStore.currentRoom.listenerCount('participantDisconnected')).toBe(0);
  });
});
