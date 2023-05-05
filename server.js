import { config } from "dotenv"

(config)()

import express from "express"
import expressAsyncError from "express-async-errors"
import { initializeDatabase } from "./src/db/index.js"
import middleware from "./src/middlewares/index.js";
import errorHandler from "./src/middlewares/errorHandler.js"
import router from "./src/routes/index.js";

initializeDatabase()

const app = express()
const PORT = process.env.PORT || 3000

middleware(app)

app.use('/api', router())

errorHandler(app)

app.listen(PORT, () => console.log(`server is listening on port ${PORT}`))