import express from 'express';
import { createReservationCheckout, handleReservationWebhook, confirmReservation, handleFinalPaymentWebhook } from '../controllers/reservation-controller.js';

const router = express.Router();

// Crear reserva (checkout de seña)
router.post('/reserve', createReservationCheckout);

// Webhook Stripe para pago de seña
router.post('/webhook', handleReservationWebhook);

// Confirmar reserva (pago final)
router.post('/confirm', confirmReservation);

// Webhook Stripe para pago final
router.post('/final-webhook', handleFinalPaymentWebhook);

export default router;
