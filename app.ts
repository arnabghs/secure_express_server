import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {validateUser} from "./src/login";
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();
const port = process.env.PORT

const jsonParser = bodyParser.json()
// const urlencodedParser = bodyParser.urlencoded({extended: false})

app.use(cors({
    origin: "http://localhost:3000"
}))

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server for you');
});

app.post('/login', jsonParser, (req: Request, res: Response) => {
    validateUser(req, res)
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});