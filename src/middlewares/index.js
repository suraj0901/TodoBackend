import cookieParser from "cookie-parser";
import cors from "cors"
import corsOptions from "../config/corsOptions.js";
import { json } from "express";
import { logger } from "./logger.js";
import Auth from "../auth/auth.route.js";


const middlewares = [logger, cookieParser(), json(), cors(corsOptions), Auth.initialise()]

export default (app) => {
    middlewares.forEach(middleware => app.use(middleware))
}