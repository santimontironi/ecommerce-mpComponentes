import client from '../config/mercadopagoConfig.js'
import { Preference } from 'mercadopago'
import Product from '../models/Product.js'
import { sendPurchaseConfirmationToCustomer } from '../services/emailService.js'
import { sendPurchaseNotificationToStore } from '../services/emailService.js'

// Crear checkout con múltiples productos
export const createCheckout = async (req, res) => {
    try {

        //recibir los datos del frontend
        const { items, buyer_email, buyer_phone } = req.body

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' })
        }

        // Buscar todos los productos: productIds = ['123abc', '456def']
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

        // Crear items para MercadoPago
        const mpItems = items.map(item => {
            const product = products.find(p => p._id.toString() === item.product_id)

            return {
                title: product.name,
                description: product.description,
                unit_price: Number(product.price),
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
                    buyer_phone: buyer_phone || ''
                },
                notification_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/webhook/mercadopago`
            }
        })

        res.json({
            url: result.init_point,  // URL de la página de pago
            preferenceId: result.id // ID de la preferencia
        })

    } catch (error) {
        console.error('❌ Error:', error)
        res.status(500).json({ error: error.message })
    }
}

// Webhook de MercadoPago
export const handleWebhook = async (req, res) => {
    try {
        console.log('📨 Webhook recibido:', req.method, req.query, req.body)

        // MercadoPago puede enviar la notificación por GET o POST
        const paymentId = req.query['data.id'] || req.body?.data?.id
        const topic = req.query.topic || req.body?.type

        // Verificar que sea una notificación de pago
        if (!paymentId || topic !== 'payment') {
            console.log('⚠️ Notificación ignorada - No es un pago')
            return res.status(200).send('OK')
        }

        console.log('💳 Procesando pago ID:', paymentId)

        // Obtener los detalles del pago desde MercadoPago
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: {
                'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`
            }
        })

        const payment = await response.json()

        console.log('📋 Estado del pago:', payment.status)

        // Solo procesar si el pago fue aprobado
        if (payment.status === 'approved') {
            console.log('✅ Pago aprobado:', payment.id)

            const items = JSON.parse(payment.metadata.items)
            const purchasedItems = []
            let total = 0

            // Decrementar stock y recopilar info de productos
            for (const item of items) {
                const product = await Product.findByIdAndUpdate(
                    item.product_id,
                    { $inc: { stock: -parseInt(item.quantity) } },
                    { new: true }
                )

                console.log(`📦 Stock actualizado: ${product.name} - Nuevo stock: ${product.stock}`)

                purchasedItems.push({
                    product_name: product.name,
                    quantity: item.quantity,
                    price: product.price
                })

                total += product.price * item.quantity
            }

            console.log('🎉 Compra procesada exitosamente')

            // Preparar datos para emails
            const purchaseData = {
                items: purchasedItems,
                buyer_email: payment.payer.email,
                buyer_phone: payment.metadata.buyer_phone || '',
                total: total,
                payment_id: payment.id
            }

            // 📧 Enviar emails
            await sendPurchaseNotificationToStore(purchaseData)
            await sendPurchaseConfirmationToCustomer(purchaseData)
        }

        res.status(200).send('OK')

    } catch (error) {
        console.error('❌ Error en webhook:', error)
        res.status(500).send('Error')
    }
}