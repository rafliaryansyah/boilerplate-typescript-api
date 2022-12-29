import Joi from "@hapi/joi";

class AuthRequest {
    registerRequest = Joi.object({
        fullName: Joi.string().min(3).required().messages({
            "string.base": "Nama lengkap harus berupa huruf.",
            "string.min": "Nama lengkap harus minimal 3 karakter.",
            "any.required": "Nama lengkap diperlukan.",
        }),
        email: Joi.string().email().required().messages({
            "string.base": "Alamat email harus berupa huruf.",
            "any.required": "Alamat email diperlukan.",
            "string.email": "Alamat email tidak valid.",
        }),
        phone: Joi.string().min(9).required().messages({
            "string.base": "Nomor telepon harus berupa angka.",
            "string.min": "Nomor telepon harus minimal 9 angka.",
            "any.required": "Nomor telepon diperlukan.",
        }),
        password: Joi.string().min(6).required().messages({
            "string.base": "Kata sandi harus berupa angka.",
            "string.min": "Kata sandi harus minimal 6 huruf.",
            "any.required": "Kata sandi diperlukan.",
        }),
    });
    verifyRequest = Joi.object().keys({
        token: Joi.string().required().messages({
            "string.base": "Token harus berupa huruf.",
            "any.required": "Query Token diperlukan.",
        }),
    });
    loginRequest = Joi.object({
        email: Joi.string().email().required().messages({
            "string.base": "Alamat email harus berupa huruf.",
            "any.required": "Alamat email diperlukan.",
            "string.email": "Alamat email tidak valid.",
        }),
        password: Joi.string().min(6).required().messages({
            "string.base": "Kata sandi harus berupa angka.",
            "string.min": "Kata sandi harus minimal 6 huruf.",
            "any.required": "Kata sandi diperlukan.",
        }),
    });
    resetPasswordRequest = Joi.object({
        token: Joi.string().required().messages({
            "string.base": "Token harus berupa huruf.",
            "any.required": "Token diperlukan.",
        }),
        newPassword: Joi.string().min(5).max(128).required().messages({
            "any.required": "kata sandi diperlukan",
            "string.min": "kata sandi harus memiliki panjang minimum {#limit}",
            "string.max": "kata sandi harus memiliki panjang maksimal {#limit}",
        }),
        confirmNewPassword: Joi.string()
            .required()
            .valid(Joi.ref("newPassword"))
            .messages({
                "any.required": "konfirmasi kata sandi diperlukan",
                "any.only":
                    "konfirmasi kata sandi harus sama dengan kata sandi awal",
                "string.min":
                    "konfirmasi kata sandi harus memiliki panjang minimum {#limit}",
                "string.max":
                    "konfirmasi kata sandi harus memiliki panjang maksimal {#limit}",
            }),
    });
    refreshTokenRequest = Joi.object({
        token: Joi.string().required().messages({
            "string.base": "Token harus berupa huruf.",
            "any.required": "Token diperlukan.",
        }),
    });
    resendEmailVerification = Joi.object({
        email: Joi.string().email().required().messages({
            "string.base": "Alamat email harus berupa huruf.",
            "any.required": "Alamat email diperlukan.",
            "string.email": "Alamat email tidak valid.",
        }),
    });
}

export default new AuthRequest();
