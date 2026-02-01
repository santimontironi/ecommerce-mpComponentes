import express from 'express';
import { createReservationCheckout, handleReservationWebhook } from '../controllers/reservation-controller.js';

const router = express.Router();

// Crear reserva (checkout de seña - 30%)
router.post('/reserve', createReservationCheckout);

// Webhook Stripe para pago de seña
router.post('/webhook', handleReservationWebhook);

export default router;
