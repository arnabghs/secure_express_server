import express, {Express, NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import {handleSignIn} from "./controllers/signIn";
import {handleSignUp} from "./controllers/signUp";
import {corsOptions} from "./middleware/cors";
import cookieParser from 'cookie-parser';
import {verifyAccessToken} from "./middleware/verifyAccessToken";
import {handleRefreshToken} from "./controllers/refresh";
import {handleLogout} from "./controllers/logout";
import {sendCorsCredentials} from "./middleware/credentials";
import {verifyAdmin, verifyAdminAndAgent} from "./middleware/verifyRoles";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000

app.use(sendCorsCredentials)
app.use(corsOptions)
app.use(express.json())
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => res.send('Test Root'))
app.post('/signin', handleSignIn)
app.post('/signup', handleSignUp)
app.get('/refresh', handleRefreshToken)
app.get('/logout', handleLogout)

app.use(verifyAccessToken)
app.get('/test-auth', verifyAdminAndAgent, (req: Request, res: Response) => res.send('Testing auth'))
app.get('/test-role', verifyAdmin, (req: Request, res: Response) => res.send('Testing role authorization'))

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});