export interface PayloadAccessToken {
    sub: string,
    iat: number,
    exp: number,
    fn: string,
    type: string
}

export interface PayloadRefreshToken {
    sub: string,
    iat: number,
    exp: number,
    type: string
}

export interface PayloadVerifyToken {
    sub: string,
    email: string,
    iat: number,
    exp: number,
    type: string,
    id: string
}

export interface PayloadResetPasswordToken {
    sub: string,
    email: string,
    iat: string,
    exp: string,
    id: string,
    type: string
}