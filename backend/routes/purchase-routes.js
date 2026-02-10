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

// Endpoint de prueba para verificar que el webhook es accesible
webhookRouter.get('/test', (req, res) => {
    console.log('✅ Webhook test endpoint llamado')
    res.json({ status: 'ok', message: 'Webhook is working' })
})

webhookRouter.post(
    '/mercadopago',
    handleWebhook
)

// MercadoPago puede notificar por GET en algunos escenarios/formatos antiguos.
webhookRouter.get(
    '/mercadopago',
    handleWebhook
)