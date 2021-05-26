import express from "express";
import getRoom from './new/getRoom';
import joinRoom from './new/joinRoom';
import muteParticipant from "./new/muteParticipant";
import twilioCallbacks from './new/recordings/twilioCallbacks';
import removeParticipant from "./new/removeParticipant";
import requestUnmuteParticipant from "./new/requestUnmuteParticipant";

const newRoute = express.Router({mergeParams: true});

newRoute.get('/getRoom', getRoom);
newRoute.post('/joinRoom', joinRoom);
newRoute.post('/muteParticipant', muteParticipant);
newRoute.post('/requetUnmuteParticipant', requestUnmuteParticipant);
newRoute.post('/removeParticipant', removeParticipant);
newRoute.post('/recordings/twilioCallbacks', twilioCallbacks);

export default newRoute;
