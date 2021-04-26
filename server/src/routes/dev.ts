import express from "express";
import authoriseParticipant from "./dev/authorise-participant";
import compositionCallback from "./dev/composition_callback";
import roomCallback from "./dev/roomCallback";
import token from "./dev/token";

const devRoute = express.Router({mergeParams: true});

devRoute.post('/token', token);
devRoute.post('/authorise-participant', authoriseParticipant);
devRoute.post('/roomCallback', roomCallback);
devRoute.get('/composition-callback', compositionCallback);

export default devRoute;
