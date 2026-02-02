import client from '../config/mercadopagoConfig.js'
import { Preference } from 'mercadopago'
import Product from '../models/Product.js'
import { sendPurchaseConfirmationToCustomer } from '../services/emailService.js'
import { sendPurchaseNotificationToStore } from '../services/emailService.js'

// Crear checkout de reserva (30% de seña)
export const createReservationCheckout = async (req, res) => {
    try {

        //recibir los datos del frontend
        const { items, buyer_email, buyer_phone } = req.body

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' })
        }

        // Buscar todos los productos
        const productIds = items.map(item => item.product_id)
        const products = await Product.find({ _id: { $in: productIds } })

        if (products.length !== items.length) {
            return res.status(404).json({ error: 'Algunos productos no existen' })
        }

        // Verificar stock
        for (const item of items) {
            const product = products.find(p => p._id.toString() === item.product_id)

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    error: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`
                })
            }
        }

        // Crear items para MercadoPago con el 30% del precio (seña)
        const mpItems = items.map(item => {
            const product = products.find(p => p._id.toString() === item.product_id)
            const reservationPrice = Number(product.price) * 0.3 // 30% de seña

            return {
                title: `RESERVA - ${product.name}`,
                description: `Seña 30% - ${product.description}`,
                unit_price: Number(reservationPrice.toFixed(2)),
                quantity: Number(item.quantity),
                currency_id: 'ARS'
            }
        })

        // Crear preferencia de MercadoPago
        const preference = new Preference(client)
        const result = await preference.create({
            body: {
                items: mpItems,
                back_urls: {
                    success: `${process.env.FRONTEND_URL}/pay-correct`,
                    failure: `${process.env.FRONTEND_URL}/pay-fail`,
                    pending: `${process.env.FRONTEND_URL}/pay-fail`
                },
                auto_return: 'approved',
                payer: {
                    email: buyer_email,
                    phone: {
                        number: buyer_phone || ''
                    }
                },
                metadata: {
                    items: JSON.stringify(items),
                    buyer_phone: buyer_phone || '',
                    is_reservation: 'true'
                },
                notification_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/webhook/mercadopago/reservation`
            }
        })

        res.json({
            url: result.init_point,
            preferenceId: result.id
        })

    } catch (error) {
        console.error('❌ Error:', error)
        res.status(500).json({ error: error.message })
    }
}

//Cuando MercadoPago confirma que el pago de reserva fue exitoso
export const handleReservationWebhook = async (req, res) => {

    try {
        const payment = req.query

        if (payment.type !== 'payment') {
            return res.status(200).send('OK')
        }

        console.log('📩 Notificación de reserva recibida:', payment.id)

        const { Payment } = await import('mercadopago')
        const paymentClient = new Payment(client)
        const paymentData = await paymentClient.get({ id: payment['data.id'] })

        if (paymentData.status !== 'approved') {
            console.log('⚠️ Reserva no aprobada:', paymentData.status)
            return res.status(200).send('OK')
        }

        console.log('✅ Reserva aprobada:', paymentData.id)

        try {
            const items = JSON.parse(paymentData.metadata.items)

            const reservedItems = []
            let totalReservation = 0

            // NO decrementamos stock en reservas, solo guardamos info
            for (const item of items) {
                const product = await Product.findById(item.product_id)

                console.log(`📋 Producto reservado: ${product.name} - Cantidad: ${item.quantity}`)

                const reservationPrice = product.price * 0.3 // 30% de seña

                reservedItems.push({
                    product_name: product.name,
                    quantity: item.quantity,
                    price: product.price,
                    reservation_paid: reservationPrice
                })

                totalReservation += reservationPrice * item.quantity
            }

            console.log('🎉 Reserva procesada exitosamente')

            const reservationData = {
                items: reservedItems,
                buyer_email: paymentData.payer.email,
                buyer_phone: paymentData.metadata.buyer_phone || '',
                total: totalReservation,
                payment_id: paymentData.id,
                is_reservation: true
            }

            // 📧 Enviar email a la tienda
            await sendPurchaseNotificationToStore(reservationData)

            // 📧 Enviar email de confirmación al cliente
            await sendPurchaseConfirmationToCustomer(reservationData)

        } catch (error) {
            console.error('❌ Error procesando reserva:', error)
        }

    } catch (error) {
        console.error('⚠️ Webhook error:', error.message)
        return res.status(400).send(`Webhook Error: ${error.message}`)
    }

    res.status(200).send('OK')
}