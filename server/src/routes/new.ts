import express from "express";
import getRoom from './new/getRoom';

const newRoute = express.Router({mergeParams: true});

newRoute.get('/getRoom', getRoom);

export default newRoute;
