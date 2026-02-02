import express from 'express';
import { createReservationCheckout, handleReservationWebhook } from '../controllers/reservation-controller.js';

const router = express.Router();

// Crear reserva (checkout de seña - 30%)
router.post('/reserve', createReservationCheckout);

// Webhook MercadoPago para pago de seña (GET y POST)
router.post('/webhook', handleReservationWebhook);
router.get('/webhook', handleReservationWebhook);

export default router;
