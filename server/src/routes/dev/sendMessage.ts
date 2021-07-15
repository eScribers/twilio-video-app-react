import { rooms } from "../../utils/rooms_sync";

const sendMessage = (req: any, res: any) => {
  try {
  const { message } = req.body;
  if(!message.length) throw new Error('No message recieved');

  const {partyName, role, personId, userId } = req.user;
  const identity = [partyName, role, personId, userId].filter(x => x).join('@');

  rooms[req.user.caseReference].list?.push({
      type: 'Message',
      time: new Date(),
      data: {
        text: message,
        user: identity,
      },
  })
  return res.send();
  } catch (err) {
    res.status(400).send({error: err.message});
  }
};

export default sendMessage;
