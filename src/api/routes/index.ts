import express, { RequestHandler } from "express";
const router = express.Router();

import auth from "./auth.route";

const defaultRoutes = [
    {
        path: "/auth",
        route: auth as RequestHandler
    }
];
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;