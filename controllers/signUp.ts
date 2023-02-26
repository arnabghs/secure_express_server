import bcrypt from 'bcrypt'
import {StatusCodes} from 'http-status-codes';
import {AuthDetailsRequest} from "../model/request";
import {Response} from "express";
import {ROLES} from "../config/roleList";
import {pool} from "../database/db";

const handleSignUp = async (req: AuthDetailsRequest, res: Response) => {
    const {emailID, password} = req.body
    if (!emailID || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({'message': 'username and password are required'})
    }
    try {
        const hashedPwd = await bcrypt.hash(password, 10)
        let newDBUser
        try {
            newDBUser = await pool.query("INSERT INTO users (email, password, role) VALUES($1, $2, $3)", [emailID, hashedPwd, ROLES.AGENT])
        } catch (e : any) {
            console.error("error while inserting to DB: ", e)
            if (e.message.includes("duplicate key value")) return res.status(StatusCodes.CONFLICT).json({'message': 'user already exists'})
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
        res.status(StatusCodes.CREATED).json(newDBUser)
    } catch (e: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({'message': e.message})
    }
}

export {handleSignUp}