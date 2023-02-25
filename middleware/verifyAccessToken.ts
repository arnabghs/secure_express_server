import {NextFunction, Response, Request} from "express";
import {StatusCodes} from "http-status-codes";
import jwt, {Secret} from 'jsonwebtoken';
import {AuthenticatedUserRequest} from "../model/request";
import {AccessJwtPayload} from "../model/jwtPaylaod";

const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(StatusCodes.UNAUTHORIZED)

    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret, (err, decoded) => {
            if (err) {
                res.sendStatus(StatusCodes.FORBIDDEN)
                return
            }
            (req as AuthenticatedUserRequest).userEmail = (decoded as AccessJwtPayload).email;
            (req as AuthenticatedUserRequest).userRole = (decoded as AccessJwtPayload).role;
            next()
        }
    )
}

export {verifyAccessToken}