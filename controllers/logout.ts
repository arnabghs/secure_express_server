import {Response, Request} from "express";
import {StatusCodes} from "http-status-codes";
import {pool} from "../database/db";

const handleLogout = async (req: Request, res: Response) => {
    const cookies = req.cookies
    const refreshToken = cookies?.jwt
    if (!refreshToken) return res.sendStatus(StatusCodes.NO_CONTENT)
    try {
        await pool.query("UPDATE users SET refresh_token  = '' WHERE refresh_token = $1", [refreshToken])
    } catch (e : any) {
        console.error("error while cleaning refresh token: ", e)
        return res.sendStatus(StatusCodes.NO_CONTENT)
    }
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true})
    res.status(StatusCodes.OK).send("successfully logged out")
}

export {handleLogout}