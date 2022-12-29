import { PrismaClient } from "@prisma/client";
import { User, UserRegisterRequest, UserResetPasswordRequest } from "../interfaces/auth.interface";
import ApiError from "../../utils/api.error.utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../../config/app.config";
import { PayloadVerifyToken } from '../interfaces/token.interface';
import tokenService from "./token.service";
const prisma = new PrismaClient();

class UserService {
    createUser = async (body: UserRegisterRequest["body"]) => {
        if (await this.isEmailTaken(body.email)) {
            throw new ApiError(400, "Bad Request", "Alamat email tidak dapat digunakan.");
        }
        const role = await prisma.role.findFirst({
            where: {
                name: "User",
            },
        });
        if (!role) {
            throw new ApiError(
                501,
                "Not Implemented",
                "Konfigurasi aplikasi belum lengkap."
            );
        }
        const hashPassword = await bcrypt.hash(body.password, 10);
        return await prisma.user.create({
            data: {
                fullName: body.fullName,
                email: body.email,
                phone: body.phone,
                password: hashPassword.toString(),
                isActive: true,
                roles: {
                    create: [
                        {
                            role: {
                                connect: { id: role?.id },
                            },
                        },
                    ],
                },
            },
        });
    };
    loginWithEmailAndPassword = async (email: string, password: string) => {
        const user: User | null = await this.getUserByEmail(email);
        if (!user) {
            throw new ApiError(400, "Bad Request", "Alamat email atau password salah");
        }
        if (!(await this.isPasswordMatch(password, user.password))) {
            throw new ApiError(400, "Bad Request", "Alamat email atau password salah");
        }
        return user;
    };
    resetPassword = async (body: UserResetPasswordRequest["body"]) => {
        const resetPasswordToken = await tokenService.verifyResetPassword(body.token);
        const user = await this.getUserByUserId(resetPasswordToken.sub);
        if (resetPasswordToken.id != user?.password) throw new ApiError(400, "Bad Request", "Reset password tidak valid!");
        if (!user) throw new ApiError(404, "Not Found", "pengguna tidak ada, pengguna tidak ditemukan");
        return await prisma.user.update({ 
            data: {
                password: await bcrypt.hash(body["newPassword"], 10)
            },
            where: {
                id: user.id
            }
        });
    };

    // Additional function for CRUD
    isEmailTaken = async (email: string) => {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return !!user;
    };
    isPasswordMatch = (requestPassword: string, currentPassword: string) => {
        return bcrypt.compare(requestPassword, currentPassword);
    };
    getUserByEmail = async (email: string) => {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        return user;
    };
    getUserByUserId = async (userId: string) => {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        return user;
    };
    userVerificationStatus = async (userId: string) => {
        const user = await this.getUserByUserId(userId);
        if (user?.emailVerifiedAt !== null) {
            throw new ApiError(400, "BadRequest", "Akun sudah melakukan verifikasi.");
        }
        return await prisma.user.update({
            data: {
                emailVerifiedAt: new Date(),
                isActive: true
            },
            where: {
                id: user.id
            }
        });
    };
    emailVerify = async(token: string) => {
        const verified = jwt.verify(token, config.jwt.verify.token) as PayloadVerifyToken;
        if (verified.type !== "VERIFY_EMAIL") {
            throw new ApiError(400, "Unauthorized", "Jenis token tidak valid");
        }
        return await this.userVerificationStatus(verified["sub"]);
    };
}

export default new UserService();
