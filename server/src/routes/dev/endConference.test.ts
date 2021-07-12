import endConference from "./endConference";

jest.mock('../../utils/twilio_client');

class mockReq {
  constructor (options?:any) {
    return ({
      body: options?.body || {},
      query: {},
      headers: {},
      user: options?.user || {}
    });
  }
}

class mockRes {
  send = jest.fn

  status = () => this
  
}

describe('Testing endConference endpoint', () => {
  let req:any, res = new mockRes;

  it(`should fail when there's no roomSid`, async () => {
    req = new mockReq();
    await expect(endConference(req, res) ).rejects.toThrow('No roomSid provided');
  })

  it(`should fail as Parent role`, async () => {
      req = new mockReq({
      body: {
        roomSid: '1',
      },
      user: {role: 'Parent'}
    });
    await expect(endConference(req, res) ).rejects.toThrow(`Participant doesn't have the required role to end conference`);
  })

  it(`should call update with status completed`, async () => {
    jest.spyOn(res, 'send');
      req = new mockReq({
      body: {
        roomSid: '1',
      },
      user: {role: 'Reporter'}
    });
    const endConference = require("./endConference").default;

    await endConference(req, res);
    expect(res.send ).toHaveBeenCalledWith({OK: true});
  });

})