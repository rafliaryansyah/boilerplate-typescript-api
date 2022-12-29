import { Request, Response, NextFunction } from "express";

export const catchAsync = (func: any) => (request: Request, response: Response, next: NextFunction) => {
    Promise.resolve(func(request, response, next)).catch(
        (error) => {
            if (error.isJoi == true) {
                error.status = 400
                error.name = "Bad Request"
            }
            console.log('This Error : ', error);
            next(error);
        }
    );
};