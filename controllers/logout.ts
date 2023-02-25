import {Response, Request} from "express";
import {StatusCodes} from "http-status-codes";
import {User, Users} from "../model/user";
import dbUsers from "../model/users.json";
import fs from "fs";

const handleLogout = async (req: Request, res: Response) => {
    const usersDB: Users = {
        users: dbUsers
    }
    const cookies = req.cookies
    const refreshToken = cookies?.jwt
    if (!refreshToken) return res.sendStatus(StatusCodes.NO_CONTENT)

    const foundUser = usersDB.users.find(user => user.refreshToken === refreshToken)
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true})
        return res.sendStatus(StatusCodes.NO_CONTENT)
    }

    const updatedUsers = usersDB.users.map((user: User): User => {
        if (user.email == foundUser.email) return {...user, refreshToken: ""}
        return user
    })
    await fs.promises.writeFile('./model/users.json', JSON.stringify(updatedUsers))
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true})
    res.sendStatus(StatusCodes.NO_CONTENT)
}

export {handleLogout}