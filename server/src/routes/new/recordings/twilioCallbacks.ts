import express from "express";


// Handle all callbacks from twilio
const twilioCallbacks = async (req: express.Request, res: express.Response) => {

  // We should group events by type (e.g recordings, compositions, room), handle them and return an answer
  const event = 'recording-started';
  // participant-joined
  // room-ended
  // composition-ready
  // ...etc

  return res.send("OK");
}

export default twilioCallbacks;