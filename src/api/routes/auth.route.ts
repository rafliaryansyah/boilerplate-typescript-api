import express from "express";
const route = express.Router();

import authController from "../controllers/auth.controller";

route.post("/register", authController.register);
route.get("/verify", authController.verify);
route.post("/login", authController.login);
route.post("/forgot-password", authController.forgotPassword);
route.post("/reset-password", authController.resetPassword);
route.post("/refresh-token", authController.refreshToken);
route.post("/resend-email-verification", authController.resendEmailVerification);

export default route;