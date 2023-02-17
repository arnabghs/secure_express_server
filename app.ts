import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server for you');
});

app.post('/login', (req : Request, res : Response) => {
    const respondBody = {role: "agent"}
    res.send(respondBody)
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});