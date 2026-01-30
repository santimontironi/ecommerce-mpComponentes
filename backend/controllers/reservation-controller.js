import stripe from '../config/stripeConfig.js'
import Product from '../models/Product.js'
import Reservation from '../models/Reservation.js'
import { sendReservationConfirmationToCustomer } from '../services/emailService.js'
import { sendReservationNotificationToStore } from '../services/emailService.js'

const DEPOSIT_PERCENTAGE = 0.30 // 30% de seña

// Crear checkout para reserva (cobrar solo el 30%)
export const createReservationCheckout = async (req, res) => {
    try {
        const { items, buyer_email } = req.body

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'El carrito de reserva está vacío' })
        }

        // Buscar todos los productos
        const productIds = items.map(item => item.product_id)
        const products = await Product.find({ _id: { $in: productIds } })

        if (products.length !== items.length) {
            return res.status(404).json({ error: 'Algunos productos no existen' })
        }

        // Verificar stock disponible
        for (const item of items) {
            const product = products.find(p => p._id.toString() === item.product_id)
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    error: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`
                })
            }
        }

        // Crear line_items para Stripe (solo el 30% del precio)
        const lineItems = items.map(item => {
            const product = products.find(p => p._id.toString() === item.product_id)
            const depositAmount = Math.round(product.price * DEPOSIT_PERCENTAGE * 100)

            return {
                price_data: {
                    currency: 'ars',
                    product_data: {
                        name: `${product.name} (Seña 30%)`,
                        description: `Reserva del producto: ${product.description}`
                    },
                    unit_amount: depositAmount
                },
                quantity: item.quantity
            }
        })

        // Crear sesión de Stripe para la seña
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',

            success_url: 'http://localhost:5173/reservation-success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:5173/reservation-cancel',

            customer_email: buyer_email,
            metadata: {
                items: JSON.stringify(items),
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
            const items = JSON.parse(session.metadata.items)

            // Recopilar información de productos
            const reservedItems = []
            let totalAmount = 0
            let depositAmount = 0

            // Procesar cada producto
            for (const item of items) {
                const product = await Product.findById(item.product_id)

                if (!product) {
                    console.error(`Producto no encontrado: ${item.product_id}`)
                    continue
                }

                // Guardar info para la reserva
                reservedItems.push({
                    product_id: product._id,
                    product_name: product.name,
                    quantity: item.quantity,
                    price: product.price,
                    deposit_paid: Math.round(product.price * DEPOSIT_PERCENTAGE * item.quantity)
                })

                const itemTotal = product.price * item.quantity
                totalAmount += itemTotal
                depositAmount += Math.round(itemTotal * DEPOSIT_PERCENTAGE)
            }

            // Crear registro de reserva en la BD
            const reservation = new Reservation({
                user_email: session.customer_email,
                products: reservedItems,
                total_amount: totalAmount,
                deposit_amount: depositAmount,
                status: 'deposit_paid',
                stripe_session_id: session.id,
                stripe_payment_intent_id: session.payment_intent
            })

            await reservation.save()

            console.log(`🎉 Reserva creada: ${reservation._id}`)

            // Preparar datos para emails (solo primer producto, ya que es reserva de uno solo)
            const item = reservedItems[0];
            const reservationData = {
                product_name: item.product_name,
                quantity: item.quantity,
                unit_price: item.price,
                total_amount: totalAmount,
                deposit_amount: depositAmount,
                buyer_email: session.customer_email,
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

// Obtener reservas del usuario
export const getUserReservations = async (req, res) => {
    try {
        const { email } = req.query

        if (!email) {
            return res.status(400).json({ error: 'Email es requerido' })
        }

        const reservations = await Reservation.find({ user_email: email })
            .populate('products.product_id')
            .sort({ createdAt: -1 })

        res.json(reservations)

    } catch (error) {
        console.error('❌ Error obteniendo reservas:', error)
        res.status(500).json({ error: error.message })
    }
}

// Confirmar reserva (pagar el 70% restante y completar compra)
export const confirmReservation = async (req, res) => {
    try {
        const { reservationId } = req.body

        const reservation = await Reservation.findById(reservationId)

        if (!reservation) {
            return res.status(404).json({ error: 'Reserva no encontrada' })
        }

        if (reservation.status !== 'deposit_paid') {
            return res.status(400).json({ error: 'La reserva no puede ser confirmada en este estado' })
        }

        // Crear line items para pagar el 70% restante
        const lineItems = reservation.products.map(item => {
            const remainingAmount = Math.round((item.price * 0.70) * 100) // 70% restante

            return {
                price_data: {
                    currency: 'ars',
                    product_data: {
                        name: `${item.product_name} (Pago final 70%)`,
                        description: 'Saldo pendiente de reserva'
                    },
                    unit_amount: remainingAmount
                },
                quantity: item.quantity
            }
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',

            success_url: 'http://localhost:5173/reservation-completed?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:5173/reservation-fail',

            customer_email: reservation.user_email,
            metadata: {
                reservationId: reservationId.toString(),
                type: 'reservation_final_payment'
            }
        })

        res.json({
            url: session.url,
            sessionId: session.id
        })

    } catch (error) {
        console.error('❌ Error confirmando reserva:', error)
        res.status(500).json({ error: error.message })
    }
}

// Webhook para pago final de reserva
export const handleFinalPaymentWebhook = async (req, res) => {
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

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object

        if (session.metadata.type === 'reservation_final_payment') {
            console.log('✅ Pago final completado:', session.id)

            try {
                const reservationId = session.metadata.reservationId
                const reservation = await Reservation.findById(reservationId)

                if (!reservation) {
                    console.error('Reserva no encontrada')
                    res.json({ received: true })
                    return
                }

                // Decrementar stock por cada producto
                for (const item of reservation.products) {
                    await Product.findByIdAndUpdate(
                        item.product_id,
                        { $inc: { stock: -parseInt(item.quantity) } },
                        { new: true }
                    )
                }

                // Actualizar estado de reserva
                reservation.status = 'completed'
                await reservation.save()

                console.log(`🎉 Reserva completada: ${reservationId}`)

                // Preparar datos para email (solo primer producto)
                const item = reservation.products[0];
                const completionData = {
                    product_name: item.product_name,
                    quantity: item.quantity,
                    unit_price: item.price,
                    total_amount: reservation.total_amount,
                    deposit_amount: reservation.deposit_amount,
                    buyer_email: reservation.user_email,
                    reservation_id: reservation._id,
                    expiration_date: reservation.expiration_date,
                    payment_id: session.id
                };

                // 📧 Enviar emails
                await sendReservationConfirmationToCustomer(completionData);
                await sendReservationNotificationToStore(completionData);

            } catch (error) {
                console.error('❌ Error procesando pago final:', error)
            }
        }
    }

    res.json({ received: true })
}
