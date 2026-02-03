import { Router } from 'express'
import {
    createPreference,
    handleWebhook
} from '../controllers/purchase-controller.js'

export const router = Router()

router.post(
    '/purchase/create-preference',
    createPreference
)

export const webhookRouter = Router()

webhookRouter.post(
    '/mercadopago',
    handleWebhook
)

// MercadoPago puede notificar por GET en algunos escenarios/formatos antiguos.
webhookRouter.get(
    '/mercadopago',
    handleWebhook
)