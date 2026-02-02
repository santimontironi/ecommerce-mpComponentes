import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors";
import {router as adminRouter} from "./routes/admin-routes.js";
import {router as productRouter} from "./routes/product-routes.js";
import { router as purchaseRouter, webhookRouter } from "./routes/purchase-routes.js";
import {router as categoryRouter} from "./routes/category-routes.js";
import { router as contactRouter } from "./routes/contact-routes.js";
import reservationRouter from "./routes/reservation-routes.js";

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use('', adminRouter)
app.use('', productRouter)
app.use('', purchaseRouter)
app.use('/webhook', webhookRouter)
app.use('', categoryRouter)
app.use('', contactRouter)
app.use('/reservation', reservationRouter)

export default app