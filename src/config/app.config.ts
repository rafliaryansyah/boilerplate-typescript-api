import * as dotenv from "dotenv";
import { Tracing } from "trace_events";
dotenv.config();

export const config = {
    "env": process.env.APP_ENV,
    "url": process.env.APP_URL,
    "jwt": {
        "access": {
            "token": process.env.JWT_ACCESS_SECRET as string,
            "expired": process.env.JWT_ACCESS_EXPIRED as unknown as number,
        },
        "refresh": {
            "token": process.env.JWT_REFRESH_SECRET as string,
            "expired": process.env.JWT_ACCESS_EXPIRED as unknown as number,
        },
        "verify": {
            "token": process.env.JWT_VERIFY_SECRET as string,
        },
        "expiredUnit": process.env.JWT_EXPIRED_UNIT
    },
    "googleApi": {
        "auth": {
            "type": process.env.GOOGLE_API_TYPE as string,
            "user": process.env.GOOGLE_API_USER_MAIL,
            "clientId": process.env.GOOGLE_API_CLIENT_ID,
            "clientSecret": process.env.GOOGLE_API_CLIENT_SECRET,
            "refreshToken": process.env.GOOGLE_API_REFRESH_TOKEN,
            "redirectUri": process.env.GOOGLE_API_REDIRECT_URI
        },
    },
    "frontend": {
        "url": process.env.FRONTEND_RESET_PASSWORD as string
    }
};