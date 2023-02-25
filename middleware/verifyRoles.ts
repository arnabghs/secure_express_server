import {ROLES} from "../config/roleList";
import {StatusCodes} from "http-status-codes";
import {AuthenticatedUserRequest} from "../model/request";
import {NextFunction, Response, Request} from "express";

const verifyRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const role : string | undefined = (req as AuthenticatedUserRequest)?.userRole
        if (!role) return res.sendStatus(StatusCodes.UNAUTHORIZED)
        if (allowedRoles.includes(role)) {
            return next()
        }
        return res.sendStatus(StatusCodes.UNAUTHORIZED)
    }
}

const verifyAdmin = verifyRoles(ROLES.ADMIN)
const verifyAdminAndAgent = verifyRoles(ROLES.ADMIN, ROLES.AGENT)

export {verifyAdmin, verifyAdminAndAgent}
