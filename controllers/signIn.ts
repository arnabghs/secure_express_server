import {User, Users} from "../model/user";
import {StatusCodes} from "http-status-codes";
import bcrypt from "bcrypt";
import jwt, {Secret} from 'jsonwebtoken';
import dbUsers from '../model/users.json'
import fs from "fs";
import {AuthDetailsRequest} from "../model/request";
import {Response} from "express";

const handleSignIn = async (req: AuthDetailsRequest, res: Response) => {
    const usersDB: Users = {
        users: dbUsers
    }

    const {emailID, password} = req.body
    if (!emailID || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({'message': 'username and password are required'})
    }
    const foundUser = usersDB.users.find(user => user.email === emailID);
    if (!foundUser) return res.status(StatusCodes.UNAUTHORIZED).json({'message': 'user not found'})

    const isPwdCorrect = await bcrypt.compare(password, foundUser.password)
    if (isPwdCorrect) {
        const accessToken = jwt.sign(
            {"email": foundUser.email},
            process.env.ACCESS_TOKEN_SECRET as Secret,
            {expiresIn: '1h'}
        )

        const refreshToken = jwt.sign(
            {"email": foundUser.email},
            process.env.REFRESH_TOKEN_SECRET as Secret,
            {expiresIn: '1d'}
        )
        const updatedUsers = usersDB.users.map((user: User): User => {
            if (user.email == foundUser.email) return {...user, refreshToken: refreshToken}
            return user
        })
        await fs.promises.writeFile('./model/users.json', JSON.stringify(updatedUsers))

        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'none',  maxAge: 24 * 60 * 60 * 1000}) //for prod : secure: true
        res.json({role: foundUser.role, accessToken: accessToken})
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({'message': 'incorrect password'})
    }
}

export {handleSignIn}