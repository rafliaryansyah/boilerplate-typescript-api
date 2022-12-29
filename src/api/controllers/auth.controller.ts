import { Response } from "express";
import { catchAsync } from "../../utils/catch.async.utils";
import { User, UserLoginRequest, UserRegisterRequest, UserResetPasswordRequest, UserVerifyRequest } from '../interfaces/auth.interface';
import userService from "../services/user.service";
import authRequest from "../requests/auth.request";
import tokenService from "../services/token.service";
import { registrationVerifiedEmail, resetPasswordAccount } from "../services/email.service";
import ApiError from "../../utils/api.error.utils";

class AuthController {
    register = (catchAsync(async (request: UserRegisterRequest, response: Response) => {
        const body = await authRequest.registerRequest.validateAsync(request.body);
        const user: User = await userService.createUser(body);
        const token = await tokenService.generateTokenForRegistration(user.email, "VERIFY_EMAIL");
        await registrationVerifiedEmail(user.email, token);
        const { access, refresh } = await tokenService.generateAuthAndRefreshToken(user);
        response.send({ code: 200, status: "OK", data: {
            user: {
                fullName: user.fullName,
                email: user.email,
                phone: user.phone
            },
            token: { access, refresh }
        } });
    }));
    verify = (catchAsync(async (request: UserVerifyRequest, response: Response) => {
        const query: UserVerifyRequest["query"] = await authRequest.verifyRequest.validateAsync(request.query);
        await userService.emailVerify(query.token);
        response.send({ code: 200, status: "OK", message: "Berhasil melakukan verifikasi akun." });
    }));
    login = (catchAsync(async (request: UserLoginRequest, response: Response) => {
        const body: UserLoginRequest["body"] = await authRequest.loginRequest.validateAsync(request.body);
        const { email, password } = body;
        const user: User = await userService.loginWithEmailAndPassword(email, password);
        const { access, refresh } = await tokenService.generateAuthAndRefreshToken(user);
        response.send({ code: 200, status: "OK", data: {
            user: { fullName: user.fullName, email: user.email, phone: user.phone },
            token: { access, refresh }
        } });
    }));
    forgotPassword = (catchAsync(async (request: UserLoginRequest, response: Response) => {
        const body: UserLoginRequest["body"] = await authRequest.resendEmailVerification.validateAsync(request.body);
        const user: User | null = await userService.getUserByEmail(body.email);
        if (!user) {
            throw new ApiError(404, "Not Found", "Alamat email tidak ada, alamat email tidak ditemukan.")
        }
        const token = await tokenService.generateTokenForRegistration(user.email, "RESET_PASSWORD");
        await resetPasswordAccount(body.email, token);
        response.send({ code: 200, status: "OK", message: "Email pengaturan ulang kata sandi telah dikirim ke alamat email Anda." });
    }));
    resetPassword = (catchAsync(async (request: UserResetPasswordRequest, response: Response) => {
        const body: UserResetPasswordRequest["body"] = await authRequest.resetPasswordRequest.validateAsync(request.body);
        await userService.resetPassword(body);
        response.send({ code: 200, status: "OK", message: "Kata sandi berhasil diperbarui." });
    }));
    refreshToken = (catchAsync(async (request: Request, response: Response) => {
        const body = await authRequest.refreshTokenRequest.validateAsync(request.body);
        const token = await tokenService.verifyRefreshToken(body.token);
        const user = await userService.getUserByUserId(token.sub);
        if (!user) {
            throw new ApiError(400, "Bad Request", "Data tidak valid");
        }
        const { access, refresh } = await tokenService.generateAuthAndRefreshToken(user);
        response.send({ code: 200, status: "OK", data: {
            token: { access, refresh }
        }});
    }));
    resendEmailVerification = (catchAsync(async(request: Request, response: Response) => {
        const body: UserLoginRequest["body"] = await authRequest.resendEmailVerification.validateAsync(request.body);
        const user: User | null = await userService.getUserByEmail(body.email);
        if (!user) {
            throw new ApiError(404, "Not Found", "Alamat email tidak ada, alamat email tidak ditemukan.")
        }
        if (user.emailVerifiedAt !== null) {
            throw new ApiError(400, "BadRequest", "Akun sudah melakukan verifikasi.");
        }
        const token = await tokenService.generateTokenForRegistration(user.email, "VERIFY_EMAIL");
        await registrationVerifiedEmail(user.email, token);
        response.send({ code: 200, status: "OK", message: "Berhasil mengirim alamat email verifikasi ulang." });
    }));
}

export default new AuthController;