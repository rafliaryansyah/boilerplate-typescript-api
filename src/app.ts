import * as dotenv from "dotenv";
dotenv.config();
import express, {
    Express,
    NextFunction,
    Request,
    Response
} from "express";
import router from "./api/routes";
import { print } from "./routes";

const app: Express = express();
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
// import fs from "fs";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Define your app routes and handling logic here
app.use("/pos/foods", router);
app.get("/", async (request: Request, response: Response) => {
    response.send({ message:  "Application program interface is working." });
});

app.use("*", (request: Request, response: Response) =>
    response
        .status(404)
        .send({
            code: 404,
            status: "NotFound",
            message: "Resource url tidak ditemukan",
        })
);
app.use(async (request: Request, response, next) =>
    next(Error("Internet Server Error"))
);

app.use(
    async (
        error: any,
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        console.log(`Big Error => `, error);
        response.status(error["status"] || 500).send({
            code: error["status"] || 500,
            status: error["name"] || "Error",
            message:
                error["message"] ||
                "Resource tidak ditemukan, atau endpoint tidak ada",
        });
    }
);

app._router.stack.forEach(print.bind(null, []));
const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
