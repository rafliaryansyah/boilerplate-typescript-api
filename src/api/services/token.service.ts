import apiError from "../../utils/api.error.utils";
import { User } from "../interfaces/auth.interface";
import UserService from "./user.service";
import jwt from "jsonwebtoken";
import { config } from "../../config/app.config";
import { PayloadVerifyToken } from "../interfaces/token.interface";

class TokenService {
    generateTokenForRegistration = async (email: string, type: string) => {
        const user: User | null = await UserService.getUserByEmail(email);
        if (!user) throw new apiError(404, "Not Found", "Pengguna tidak ditemukan dengan alamat email ini");
        const expired = Math.floor(new Date().getTime()/1000.0) + 86400;
        return this.generateToken(user, type, expired, config.jwt.verify.token);
    };

    generateAuthAndRefreshToken = async (user: User) => {
        const access = await this.generateAuthenticationToken(user);
        const refresh = await this.generateAuthenticationRefreshToken(user);
        return { access, refresh };
    };

    generateAuthenticationToken = async(user: User) => {
        const expired = config.jwt.access.expired * 86400;
        const epochTime = Math.floor(new Date().getTime()/1000.0) * expired;
        return this.generateToken(user, "ACCESS", epochTime, config.jwt.access.token);
    };
    
    generateAuthenticationRefreshToken = async(user: User) => {
        const expired = config.jwt.refresh.expired * 86400;
        const epochTime = Math.floor(new Date().getTime()/1000.0) * expired;
        return this.generateToken(user, "REFRESH", epochTime, config.jwt.refresh.token);
    };

    verifyToken = async(token: string) => {
        try {
            const payload = jwt.verify(token, config.jwt.verify.token) as PayloadVerifyToken;
            return payload;
        } catch (error) {
            throw new apiError(400, "Unauthorized", "token tidak valid");
        }
    };

    verifyResetPassword = async(token: string) => {
        try {
            const payload = jwt.verify(token, config.jwt.verify.token) as PayloadVerifyToken;
            return payload;
        } catch (error) {
            throw new apiError(400, "Unauthorized", "token tidak valid");
        }
    };

    verifyRefreshToken = async(token: string) => {
        try {
            const payload = jwt.verify(token, config.jwt.refresh.token) as PayloadVerifyToken;
            return payload;
        } catch (error) {
            throw new apiError(400, "Unauthorized", "token tidak valid");
        }
    };

    generateToken = (user: User, type: string, expired: number, secret: string) => {
        let payload = {};
        switch (type) {
            case "RESET_PASSWORD":
                payload = {
                    sub: user.id,
                    email: user.email,
                    iat: Math.floor(new Date().getTime()/1000.0),
                    exp: expired,
                    id: user.password,
                    type
                };
                break;
            case "VERIFY_EMAIL":
                payload = {
                    sub: user.id,
                    iat: Math.floor(new Date().getTime()/1000.0),
                    email: user.email,
                    exp: expired,                                        
                    type
                };
                break;
            case "ACCESS":
                payload = {
                    sub: user.id,
                    iat: Math.floor(new Date().getTime()/1000.0),
                    exp: expired,
                    fn: user.fullName,
                    type
                };
                break;
            case "REFRESH":
                payload = {
                    sub: user["id"],
                    iat: Math.floor(new Date().getTime()/1000.0),
                    exp: expired,
                    type
                };
                break;
            default:
                // payload = {};
                break;
        }
        return jwt.sign(payload, secret);
    };
}

export default new TokenService;