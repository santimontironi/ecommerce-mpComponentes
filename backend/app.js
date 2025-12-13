import express from "express";
import dotenv from "dotenv"
import cookieparser from "cookie-parser";
import cors from "cors";
import {router as adminRouter} from "./routes/admin-routes.js";

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieparser())

app.use(cors({
    origin: process.env.FRONTEND_URL_DEV,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use('', adminRouter)

export default app