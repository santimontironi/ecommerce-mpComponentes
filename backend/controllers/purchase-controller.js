import client from '../config/mercadopagoConfig.js'
import { Preference, Payment } from 'mercadopago'
import Product from '../models/Product.js'
import { sendPurchaseNotificationToStore, sendPurchaseConfirmationToCustomer } from '../services/emailService.js'

// ===============================
// CREATE PREFERENCE
// ===============================

// Controlador que crea una preferencia de pago
export const createPreference = async (req, res) => {
    try {
        // Extrae los datos enviados desde el frontend
        const { items, buyer_email, buyer_phone } = req.body

        // URL pública del backend (necesaria para el webhook)
        const backendBaseUrl = process.env.BACKEND_URL

        // Validación de datos obligatorios
        if (!buyer_email || !buyer_phone || !items || items.length === 0) {
            // Respuesta de error si faltan datos
            return res.status(400).json({
                error: 'Datos incompletos',
                debug: {
                    buyer_email: !!buyer_email,
                    buyer_phone: !!buyer_phone,
                    items: !!items,
                    items_length: items?.length,
                    items_value: items
                }
            })
        }

        const normalizedItems = items.map(item => ({
            product_id: item.product_id,
            title: item.title,
            quantity: parseInt(item.quantity, 10),
            unit_price: parseFloat(item.unit_price)
        }))

        if (normalizedItems.some(item => !item.product_id || !item.quantity || item.quantity <= 0 || !item.unit_price)) {
            return res.status(400).json({ error: 'Los productos deben incluir product_id, quantity y unit_price válidos' })
        }

        // Crea una instancia de Preference
        const preference = new Preference(client)

        // Crea la preferencia de pago en MercadoPago
        const result = await preference.create({
            body: {
                // Productos que se van a pagar
                items: normalizedItems.map(item => ({
                    id: item.product_id,
                    title: item.title,
                    description: item.title,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    currency_id: 'ARS'
                })),

                // Datos del comprador
                payer: {
                    email: buyer_email,
                    phone: {
                        area_code: '54',
                        number: buyer_phone.replace(/\D/g, '')
                    }
                },

                // Metadata personalizada (se recupera luego en el webhook)
                metadata: {
                    buyer_email,
                    buyer_phone,
                    cart_items: JSON.stringify(normalizedItems)
                },


                // URLs a las que redirige MercadoPago según el resultado
                back_urls: {
                    success: `${process.env.FRONTEND_URL}/pay-correct`,
                    failure: `${process.env.FRONTEND_URL}/pay-fail`,
                    pending: `${process.env.FRONTEND_URL}/pay-pending`
                },

                // URL del webhook (MercadoPago avisa acá el estado del pago)
                notification_url: `${backendBaseUrl}/webhook/mercadopago`,

                // Redirige automáticamente si el pago se aprueba
                auto_return: 'approved',

                payment_methods: {
                    excluded_payment_types: [],
                    excluded_payment_methods: [],
                    installments: 1 // Número máximo de cuotas
                },

                // ✅ Configuración del checkout
                purpose: 'wallet_purchase', // Importante para pagos con saldo MP

                // ✅ Prevención de fraudes
                binary_mode: false // Permite pagos pendientes de revisión
            }
        })

        console.log('✅ Preferencia creada:', {
            id: result.id,
            init_point: result.init_point
        })

        // Devuelve al frontend el ID y el link de pago
        res.json({
            id: result.id,
            init_point: result.init_point
        })

    } catch (error) {
        // Log del error general
        console.error('❌ Error creando preferencia:', error.message || error)

        // Log del error detallado si viene desde MercadoPago
        console.error('❌ Error detalle:', JSON.stringify(error.response?.data || error))

        // Respuesta genérica de error
        res.status(500).json({ error: 'Error creando preferencia' })
    }
}

// ===============================
// WEBHOOK MERCADOPAGO
// ===============================

// Controlador que maneja las notificaciones de MercadoPago
export const handleWebhook = async (req, res) => {

    try {
        let paymentId = null

        if (req.body?.type === 'payment' && req.body?.data?.id) {
            paymentId = req.body.data.id
            console.log('💰 Payment ID desde body:', paymentId)
        }
        else if (req.query?.topic === 'payment' && req.query?.id) {
            paymentId = req.query.id
            console.log('💰 Payment ID desde query:', paymentId)
        }
        else {
            console.log('⚠️ No es notificación de pago, ignorando')
            return res.sendStatus(200)
        }

        const payment = new Payment(client)
        const paymentData = await payment.get({ id: paymentId })

        console.log('📊 Datos del pago:', {
            id: paymentData.id,
            status: paymentData.status,
            status_detail: paymentData.status_detail,
            amount: paymentData.transaction_amount,
            email: paymentData.payer?.email
        })

        if (paymentData.status !== 'approved') {
            console.log(`⚠️ Pago no aprobado: ${paymentData.status}`)
            return res.sendStatus(200)
        }

        console.log('✅ Pago aprobado, procesando stock...')

        // Obtener los items originales desde la metadata de la preferencia
        let cartItems = []
        try {
            const rawCart = paymentData.metadata?.cart_items
            if (rawCart) {
                cartItems = typeof rawCart === 'string' ? JSON.parse(rawCart) : rawCart
            }
        } catch (err) {
            console.error('⚠️ Error parseando cart_items de metadata:', err.message)
        }

        const purchasedItems = []
        let total = 0

        if (cartItems.length > 0) {
            for (const item of cartItems) {
                const productId = item.product_id
                const quantity = parseInt(item.quantity, 10)

                if (!productId || !quantity || quantity <= 0) {
                    continue
                }

                const product = await Product.findById(productId)

                if (!product) {
                    console.warn(`⚠️ Producto no encontrado para descontar stock: ${productId}`)
                    continue
                }

                await Product.findByIdAndUpdate(
                    productId,
                    { $inc: { stock: -quantity } },
                    { new: true }
                )

                purchasedItems.push({
                    product_name: product.name,
                    quantity,
                    price: product.price
                })

                total += product.price * quantity
            }
        } else {
            console.warn('⚠️ No se recibieron items en metadata. No se puede descontar stock con detalle.')
        }

        const fallbackItems = [{
            product_name: paymentData.description || 'Producto',
            quantity: 1,
            price: paymentData.transaction_amount
        }]

        const purchaseData = {
            items: purchasedItems.length ? purchasedItems : fallbackItems,
            buyer_email: paymentData.metadata?.buyer_email || paymentData.payer?.email,
            buyer_phone: paymentData.metadata?.buyer_phone,
            total: purchasedItems.length ? total : paymentData.transaction_amount,
            payment_id: paymentData.id
        }

        await sendPurchaseNotificationToStore(purchaseData)
        await sendPurchaseConfirmationToCustomer(purchaseData)

        console.log('📧 Emails enviados')
        console.log('='.repeat(50))

        res.sendStatus(200)

    } catch (error) {
        console.error('❌ ERROR EN WEBHOOK:', error)
        res.sendStatus(200)
    }
}
