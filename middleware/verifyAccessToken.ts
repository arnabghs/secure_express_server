import {NextFunction, Response, Request} from "express";
import {StatusCodes} from "http-status-codes";
import jwt, {Secret} from 'jsonwebtoken';
import {JwtPayload} from "../model/jwtPaylaod";
import {AuthenticatedUserRequest} from "../model/request";

const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) return res.sendStatus(StatusCodes.UNAUTHORIZED)

    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret, (err, decoded) => {
            if (err) {
                res.sendStatus(StatusCodes.FORBIDDEN)
                return
            }
            (req as AuthenticatedUserRequest).user = (decoded as JwtPayload).email
            next()
        }
    )
}

export {verifyAccessToken}