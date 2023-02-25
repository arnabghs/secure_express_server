import {Request} from 'express';

export interface AuthenticatedUserRequest extends Request {
    userEmail?: string,
    userRole?: string
}

export interface AuthDetailsRequest extends Request {
    body: {
        emailID: string,
        password: string
    }
}