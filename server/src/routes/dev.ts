import express from "express";
import { authorizeUser } from "../utils/auth";
import authoriseParticipant from "./dev/authoriseParticipant";
import compositionCallback from "./dev/compositionCallback";
import endConference from "./dev/endConference";
import roomCallback from "./dev/roomCallback";
import sendMessage from "./dev/sendMessage";
import token from "./dev/token";


const devRoute = express.Router({mergeParams: true});

// Paths to allow with no authenticaion header
const authWhitelist = ['token', 'authorise-participant', 'roomCallback', 'composition-callback'];

// Decode token and store it in req.user
devRoute.use(authorizeUser(authWhitelist));

devRoute.post('/token', token);
devRoute.post('/authorise-participant', authoriseParticipant);
devRoute.post('/room-callback', roomCallback);
devRoute.get('/composition-callback', compositionCallback);
devRoute.post('/send-message', sendMessage);
devRoute.post('/end-conference', endConference);

export default devRoute;
