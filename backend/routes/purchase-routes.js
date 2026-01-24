import { createCheckout, handleWebhook } from "../controllers/purchase-controller.js";

import { Router } from "express";

export const router = Router()

router.post('/purchase/checkout', createCheckout)

export const webhookRouter = Router()

webhookRouter.post(
    '/stripe',
    express.raw({ type: 'application/json' }),
    handleWebhook
)