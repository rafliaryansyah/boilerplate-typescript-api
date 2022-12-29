import nodemailer from "nodemailer";
import { google } from "googleapis";
import { config } from "../../config/app.config";

const oAuth2Client = new google.auth.OAuth2(
    config.googleApi.auth.clientId, 
    config.googleApi.auth.clientSecret, 
    config.googleApi.auth.redirectUri
);
oAuth2Client.setCredentials({ refresh_token: config.googleApi.auth.refreshToken });

const sendEmail = async (to: string, subject: string, text: string) => {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: config.googleApi.auth.user,
            clientId: config.googleApi.auth.clientId,
            clientSecret: config.googleApi.auth.clientSecret,
            refreshToken: config.googleApi.auth.refreshToken,
            accessToken: accessToken.token?.toString()
        }
    });
    if (config.env !== "test") {
        transport
            .verify()
            .then(() => console.log("Connected to email server"))
            .catch(() => console.error("Unable to connect to email server. Make sure you have configured the SMTP options in .env"));
    }
    const message = {
        from: config.googleApi.auth.user,
        to,
        subject,
        text,
        html: text
    };
    const result = transport.sendMail(message);
    return result;
};

export const registrationVerifiedEmail = async (to: string, token: string) => {
    const subject = "Verifikasi Email";
    const verifyEmailUrl = `${config.url}/verify?token=${token}`;
    const text = `<h2>Link Verifikasi Akun : <a href="${verifyEmailUrl}">Verifikasi Akun</a></h2>`;
    await sendEmail(to, subject, text);
};

export const resetPasswordAccount = async (to: string, token: string) => {
    const subject = "Reset Password";
    const verifyEmailUrl = `${config.url}/verify?token=${token}`;
    const text = `<h2>Link Reset Akun : <a href="${verifyEmailUrl}">Reset Akun</a></h2>`;
    await sendEmail(to, subject, text);
};