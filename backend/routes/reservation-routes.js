import { Router } from 'express'
import {
    createReservationCheckout,
    handleReservationWebhook
} from '../controllers/reservation-controller.js'

export const router = Router()

// Crear checkout de reserva (30% de seña)
router.post(
    '/reservation/reserve',
    createReservationCheckout
)

export const webhookRouter = Router()

// Webhook para notificaciones de MercadoPago sobre reservas
webhookRouter.post(
    '/mercadopago/reservation',
    handleReservationWebhook
)

// MercadoPago puede notificar por GET en algunos escenarios/formatos antiguos
webhookRouter.get(
    '/mercadopago/reservation',
    handleReservationWebhook
)
