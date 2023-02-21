import {Request, Response} from "express";

import dbUsers from '../model/users.json'
import { Users} from "../model/user";
import {StatusCodes} from "http-status-codes";
import bcrypt from "bcrypt";

const usersDB: Users = {
    users: dbUsers
}

const signIn = async(req: Request, res: Response) => {
    const {emailID, password} = req.body
    if (!emailID || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({'message': 'username and password are required'})
    }

    const foundUser  = usersDB.users.find(user => user.email === emailID);
    if (!foundUser) return res.status(StatusCodes.UNAUTHORIZED).json({'message': 'user not found'})

    const isPwdCorrect = await bcrypt.compare(password, foundUser.password)
    if (isPwdCorrect) {
        res.json(foundUser)
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({'message': 'incorrect password'})
    }
}

export {signIn}