import allowedOrigins from "./allowedOrigin.js";

const corsOptions = {
    origin: (origin, callback) => {
        console.log({ origin, allowedOrigins })
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        }
        else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

export default corsOptions