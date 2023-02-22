import {Request} from 'express';

export interface AuthenticatedUserRequest extends Request {
    user: string
}

export interface AuthDetailsRequest extends Request {
    body: {
        emailID: string,
        password: string
    }
}