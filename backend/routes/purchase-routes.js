import { createCheckout, handleWebhook } from "../controllers/purchase-controller.js";

import { Router } from "express";

export const router = Router()

router.post('/purchase/checkout', createCheckout)

export const webhookRouter = Router()

// MercadoPago envía notificaciones via GET con query params
webhookRouter.post('/mercadopago', handleWebhook)
webhookRouter.get('/mercadopago', handleWebhook)