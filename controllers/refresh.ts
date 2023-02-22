import {Response, Request, NextFunction} from "express";
import {StatusCodes} from "http-status-codes";
import dbUsers from '../model/users.json'
import {Users} from "../model/user";
import jwt, {Secret} from "jsonwebtoken";
import {JwtPayload} from "../model/jwtPaylaod";

const handleRefreshToken = (req: Request, res: Response) => {
    const usersDB: Users = {
        users: dbUsers
    }

    const cookies = req.cookies
    const refreshToken = cookies?.jwt
    if (!refreshToken) return res.sendStatus(StatusCodes.UNAUTHORIZED)

    const foundUser = usersDB.users.find(user => user.refreshToken === refreshToken)
    if (!foundUser) return res.sendStatus(StatusCodes.FORBIDDEN)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret, (err : any, decoded : any) => {
            if (err || foundUser.email != ((decoded as JwtPayload)).email) {
                res.sendStatus(StatusCodes.FORBIDDEN)
                return
            }
            const accessToken = jwt.sign(
                {"email": foundUser.email},
                process.env.ACCESS_TOKEN_SECRET as Secret,
                {expiresIn: '1h'}
            )
            res.json({accessToken})
        }
    )
}

export {handleRefreshToken}