import { Router } from 'express'
import {
    createPreference,
    handleWebhook
} from '../controllers/purchase-controller.js'

// Router principal para compras
export const router = Router()

router.post('/purchase/create-preference', createPreference)

// Router separado para webhook (sin JSON parsing en app.js)
export const webhookRouter = Router()

webhookRouter.post('/mercadopago', handleWebhook)
