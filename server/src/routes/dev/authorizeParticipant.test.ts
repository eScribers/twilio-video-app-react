import authoriseParticipant from "./authoriseParticipant"

describe('Testing authoriseParticipant endpoint', () => {
  it('should return a participantInfo object', () => {
    let response:any;
    const req = {};
    const res = {
      send: (val:any) => {response = val}
    };
    authoriseParticipant(req, res);
    expect(response.participantInfo.displayName).toContain('Gal Zakay');
  })

})
