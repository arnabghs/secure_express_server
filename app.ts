import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import {signIn} from "./controllers/signIn";
import {signUp} from "./controllers/signUp";
import {corsOptions} from "./middleware/cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT

const jsonParser = bodyParser.json()
// const urlencodedParser = bodyParser.urlencoded({extended: false})

app.use(corsOptions)

app.get('/', (req: Request, res: Response) => res.send('Test Root'))
app.post('/login', jsonParser, signIn)
app.post('/signup', jsonParser, signUp)

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});