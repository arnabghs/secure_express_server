import {Request, Response} from "express";

const validateUser = (req: Request, res: Response): void => {
    const emailID = req.body?.emailID
    const password = req.body?.password

    let respondBody = {role: ""}
    let statusCode = 404

    if (emailID == "agent" && password == "1234") {
        respondBody = {role: "AGENT"}
        statusCode = 200
    }
    if (emailID == "admin" && password == "1234") {
        respondBody = {role: "ADMIN"}
        statusCode = 200
    }
    res.status(statusCode).send(respondBody)
}

export {validateUser}