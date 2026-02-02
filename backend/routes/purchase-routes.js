import { Router } from 'express'
import {
    createPreference,
    handleWebhook
} from '../controllers/purchase-controller.js'

// ===============================
// ROUTER COMPRAS
// ===============================
export const router = Router()

router.post(
    '/purchase/create-preference',
    createPreference
)

// ===============================
// ROUTER WEBHOOK
// ===============================
export const webhookRouter = Router()

webhookRouter.post(
    '/mercadopago',
    handleWebhook
)