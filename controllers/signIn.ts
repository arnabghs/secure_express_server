import {User} from "../model/user";
import {StatusCodes} from "http-status-codes";
import bcrypt from "bcrypt";
import jwt, {Secret} from 'jsonwebtoken';
import {AuthDetailsRequest} from "../model/request";
import {Response} from "express";
import {pool} from "../database/db";

const handleSignIn = async (req: AuthDetailsRequest, res: Response) => {
    const {emailID, password} = req.body
    if (!emailID || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({'message': 'username and password are required'})
    }

    let dbUser: User
    try {
        let queryResult = await pool.query("select * from users where email = $1", [emailID])
        if (queryResult.rows.length === 0) return res.status(StatusCodes.UNAUTHORIZED).json({'message': 'user not found'})
        dbUser = queryResult.rows[0] as User
    } catch (e: any) {
        console.error("error while fetching user from db: ", e)
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    const isPwdCorrect = await bcrypt.compare(password, dbUser.password)
    if (isPwdCorrect) {
        const accessToken = jwt.sign({email: dbUser.email, role: dbUser.role},
            process.env.ACCESS_TOKEN_SECRET as Secret, {expiresIn: '1h'})

        const refreshToken = jwt.sign({"email": dbUser.email},
            process.env.REFRESH_TOKEN_SECRET as Secret, {expiresIn: '1d'})

        try {
            await pool.query("UPDATE users SET refresh_token  = $1 WHERE email = $2", [refreshToken, dbUser.email])
        } catch (e) {
            console.error("error while updating user token: ", e)
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000})
        res.json({role: dbUser.role, accessToken: accessToken})
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({'message': 'incorrect password'})
    }
}

export {handleSignIn}