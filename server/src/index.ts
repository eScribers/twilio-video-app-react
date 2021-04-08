import express, { Application } from "express";
import devRoute from './routes/dev';

const cors = require('cors');

const app: Application = express();

app.use(cors());
app.options('*', cors())

app.use('/dev', devRoute);

app.listen(3001, () => {
    console.log('The application running http://localhost:3001 ');
});