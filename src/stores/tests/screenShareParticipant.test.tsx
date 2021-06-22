import { act } from '@testing-library/react-hooks';
import { RootStore } from '..';
import { mockLocalParticipant, mockParticipant } from '../../utils/mocks';

function createRootStore() {
  const rootStore = new RootStore();
  const { roomStore, participantStore } = rootStore;
  const localParticipant = new mockLocalParticipant();

  participantStore.setParticipant(localParticipant);

  roomStore.room.state = 'connected';
  return rootStore;
}

describe('the useScreenShareParticipant hook', () => {
  let roomStore, participantStore;
  beforeEach(() => {
    const rootStore = createRootStore();
    roomStore = rootStore.roomStore;
    participantStore = rootStore.participantStore;
  });

  it('return undefined when there are no participants sharing their screen', () => {
    expect(participantStore.screenShareParticipant()).toEqual(undefined);
  });

  it('should return the localParticipant when they are sharing their screen', () => {
    const participant = new mockLocalParticipant();
    participant.tracks = new Map([[0, { trackName: 'screen' }]]);
    participantStore.setParticipant(participant);

    expect(participantStore.screenShareParticipant()).toEqual(participantStore.participant);
  });

  it('should return a remoteParticipant when they are sharing their screen', () => {
    const participant = new mockParticipant();
    participant.tracks = new Map([[0, { trackName: 'screen' }]]);
    participantStore.addParticipant(participant);
    expect(participantStore.screenShareParticipant()).toEqual(participant);
  });

  it('should respond to "trackPublished" and "trackUnpublished" events emitted from the localParticipant', () => {
    expect(participantStore.screenShareParticipant()).toEqual(undefined);

    act(() => {
      participantStore.participant.tracks = new Map([[0, { trackName: 'screen' }]]);
      participantStore.participant.emit('trackPublished');
    });

    expect(participantStore.screenShareParticipant()).toEqual(participantStore.participant);

    act(() => {
      participantStore.participant.tracks = new Map([]);
      participantStore.participant.emit('trackUnpublished');
    });

    expect(participantStore.screenShareParticipant()).toEqual(undefined);
  });

  it('should respond to "trackPublished" and "trackUnpublished" events emitted from the room', () => {
    const participant = new mockParticipant();
    participant.tracks = new Map([[0, { trackName: 'screen' }]]);

    expect(participantStore.screenShareParticipant()).toEqual(undefined);

    act(() => {
      participantStore.addParticipant(participant);
      roomStore.room.emit('trackPublished');
    });

    expect(participantStore.screenShareParticipant()).toEqual(participant);

    act(() => {
      participant.tracks = new Map([]);
      roomStore.room.emit('trackUnpublished');
    });

    expect(participantStore.screenShareParticipant()).toEqual(undefined);
  });

  it('should respond to "participantDisconnected" events emitted from the room', () => {
    const participant = new mockParticipant();
    participant.tracks = new Map([[0, { trackName: 'screen' }]]);
    participantStore.addParticipant(participant);

    expect(participantStore.screenShareParticipant()).toEqual(participant);

    act(() => {
      participantStore.removeParticipantSid(participant.sid);
      roomStore.room.emit('participantDisconnected');
    });

    expect(participantStore.screenShareParticipant()).toEqual(undefined);
  });

  it('should clean up all listeners when unmounted', async () => {
    let unmount = () => {};
    await act(async () => {
      unmount = await roomStore.joinRoom();
    });

    expect(roomStore.room.listenerCount('participantDisconnected')).toBe(1);
    unmount();
    expect(roomStore.room.listenerCount('participantDisconnected')).toBe(0);
  });
});
