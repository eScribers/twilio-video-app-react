import express, { Application } from "express";
import { tunnel } from "./localtunnel";
import devRoute from './routes/dev';
import newRoute from "./routes/new";

const cors = require('cors');

const app: Application = express();

app.use(cors());
app.options('*', cors())
app.use(express.json());
app.use(express.urlencoded());

app.use('/dev', devRoute);
app.use('/new', newRoute);

app.listen(3001, () => {
    console.log('The application running http://localhost:3001 ');
    tunnel.then((t:any) => {
        console.log(`Opened:`,t.url);
    });
});