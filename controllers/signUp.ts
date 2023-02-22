import * as fs from 'fs';
import bcrypt from 'bcrypt'
import {StatusCodes} from 'http-status-codes';
import dbUsers from '../model/users.json'
import {User, Users} from "../model/user";
import {AuthDetailsRequest} from "../model/request";
import { Response} from "express";

const handleSignUp = async (req: AuthDetailsRequest, res: Response) => {
    const usersDB: Users = {
        users: dbUsers
    }

    const {emailID, password} = req.body
    if (!emailID || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({'message': 'username and password are required'})
    }
    if (usersDB.users.find(user => user.email === emailID)) {
        return res.status(StatusCodes.CONFLICT).json({'message': 'user already exists'})
    }
    try {
        const hashedPwd = await bcrypt.hash(password, 10)
        const newUser: User = {email: emailID, password: hashedPwd, role: "agent"}

        const updatedUsers = ([...usersDB.users, newUser])
        await fs.promises.writeFile('./model/users.json', JSON.stringify(updatedUsers))
        res.status(StatusCodes.CREATED).json({success: `New user ${emailID} created`})
    } catch (e: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({'message': e.message})
    }
}

export {handleSignUp}