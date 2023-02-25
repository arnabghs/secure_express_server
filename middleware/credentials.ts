import {NextFunction, Request, Response} from "express";
import {allowedOrigins} from "../shared/config";

//to allow browser to store the secure   cookie
const sendCorsCredentials = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin
    if (allowedOrigins.includes(origin as string)) {
        res.header('Access-Control-Allow-Credentials', "true")
    }
    next()
}

export {sendCorsCredentials}