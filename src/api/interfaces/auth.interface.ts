import { Request } from 'express';

export interface UserRegisterRequest extends Request {
    body: {
        fullName: string,
        email: string,
        phone: string,
        password: string
    }
}

export interface UserVerifyRequest extends Request {
    query: {
        token: string
    }
}

export interface UserResetPasswordRequest extends Request {
    body: {
        newPassword: string,
        token: string,
        confirmNewPassword: string
    }
}

export interface UserLoginRequest extends Request {
    body: {
        email: string,
        password: string
    }
}

export interface User {
    id: string,
    fullName: string,
    email: string,
    phone: string,
    password: string,
    isActive: boolean,
    emailVerifiedAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
}