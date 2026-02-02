import stripe from '../config/stripeConfig.js'
import Product from '../models/Product.js'
import Reservation from '../models/Reservation.js'
import { sendReservationConfirmationToCustomer } from '../services/emailService.js'
import { sendReservationNotificationToStore } from '../services/emailService.js'

const DEPOSIT_PERCENTAGE = 0.30 // 30% de seña

// Crear checkout para reserva (cobrar solo el 30%)
export const createReservationCheckout = async (req, res) => {
    try {
        const { items, phone, buyer_email } = req.body

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'El carrito de reserva está vacío' })
        }

        // Extraer el primer (y único) item
        const item = items[0]
        const { product_id, quantity } = item

        // Buscar el producto
        const product = await Product.findById(product_id)

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }

        // Verificar stock disponible
        if (product.stock < quantity) {
            return res.status(400).json({
                error: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`
            })
        }

        // Calcular montos
        const totalAmount = product.price * quantity
        const depositAmount = Math.round(totalAmount * DEPOSIT_PERCENTAGE)

        // Crear line_item para Stripe (solo el 30% del precio)
        const lineItems = [{
            price_data: {
                currency: 'ars',
                product_data: {
                    name: `${product.name} (Seña 30%)`,
                    description: `Reserva del producto: ${product.description}`
                },
                unit_amount: Math.round(product.price * DEPOSIT_PERCENTAGE * 100)
            },
            quantity: quantity
        }]

        // Crear sesión de Stripe para la seña
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',

            success_url: 'http://localhost:5173/reservation-success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:5173/reservation-cancel',

            customer_email: buyer_email,
            customer_phone: phone,
            
            metadata: {
                product_id: product_id,
                quantity: quantity.toString(),
                type: 'reservation'
            }
        })

        res.json({
            url: session.url,
            sessionId: session.id
        })

    } catch (error) {
        console.error('❌ Error en reserva:', error)
        res.status(500).json({ error: error.message })
    }
}

// Webhook para manejar pagos de reserva
export const handleReservationWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature']
    let event

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (err) {
        console.error('⚠️ Webhook error:', err.message)
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Cuando el pago de la seña se completa
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object

        console.log('✅ Seña pagada:', session.id)

        try {
            const { product_id, quantity } = session.metadata

            // Buscar el producto
            const product = await Product.findById(product_id)

            if (!product) {
                console.error(`Producto no encontrado: ${product_id}`)
                return res.json({ received: true })
            }

            // Calcular montos
            const totalAmount = product.price * parseInt(quantity)
            const depositAmount = Math.round(totalAmount * DEPOSIT_PERCENTAGE)

            // Crear registro de reserva en la BD
            const reservation = new Reservation({
                user_email: session.customer_email,
                product_id: product._id,
                product_name: product.name,
                quantity: parseInt(quantity),
                price: product.price,
                total_amount: totalAmount,
                deposit_amount: depositAmount,
                status: 'deposit_paid',
                stripe_session_id: session.id,
                stripe_payment_intent_id: session.payment_intent
            })

            await reservation.save()

            console.log(`🎉 Reserva creada: ${reservation._id}`)

            // Preparar datos para emails
            const reservationData = {
                product_name: product.name,
                quantity: parseInt(quantity),
                unit_price: product.price,
                total_amount: totalAmount,
                deposit_amount: depositAmount,
                buyer_email: session.customer_email,
                buyer_phone: session.customer_phone,
                reservation_id: reservation._id,
                expiration_date: reservation.expiration_date,
                payment_id: session.id
            };

            // 📧 Enviar email a la tienda
            await sendReservationNotificationToStore(reservationData);

            // 📧 Enviar email de confirmación al cliente
            await sendReservationConfirmationToCustomer(reservationData);

        } catch (error) {
            console.error('❌ Error procesando reserva:', error)
        }
    }

    res.json({ received: true })
}
