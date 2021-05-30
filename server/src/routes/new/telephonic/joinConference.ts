import express from 'express';

const joinConference = async (req: express.Request, res: express.Response) => {

  // Ask the participant to enter hearing code (unique, 8 digits)
  // For example 81145041
  // We will generate unique numbers for each participant group (parent, district rep etc) on TABula side
  

  return res.send('<TwiML>...</TwiML>');
}

export default joinConference;