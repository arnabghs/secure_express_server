import {Response, Request} from "express";
import {StatusCodes} from "http-status-codes";
import jwt, {Secret} from "jsonwebtoken";
import {RefreshJwtPayload} from "../model/jwtPaylaod";
import {User} from "../model/user";
import {pool} from "../database/db";

const handleRefreshToken = async(req: Request, res: Response) => {
    const cookies = req.cookies
    const refreshToken = cookies?.jwt
    if (!refreshToken) return res.sendStatus(StatusCodes.UNAUTHORIZED)

    let dbUser: User
    try {
        let queryResult = await pool.query("select * from users where refresh_token = $1", [refreshToken])
        if (queryResult.rows.length === 0) return res.status(StatusCodes.FORBIDDEN).json({'message': 'user not found'})
        dbUser = queryResult.rows[0] as User
    } catch (e: any) {
        console.error("error while fetching user from db: ", e)
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret, (err: any, decoded: any) => {
            if (err || dbUser.email != ((decoded as RefreshJwtPayload)).email) {
                res.sendStatus(StatusCodes.FORBIDDEN)
                return
            }
            const accessToken = jwt.sign({email: dbUser.email, role: dbUser.role},
                process.env.ACCESS_TOKEN_SECRET as Secret, {expiresIn: '1h'})

            res.json({accessToken: accessToken, role: dbUser.role})
        }
    )
}

export {handleRefreshToken}