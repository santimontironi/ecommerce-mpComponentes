import { Preference, Payment } from 'mercadopago'
import client from '../config/mercadopagoConfig.js'
import { sendPurchaseNotificationToStore, sendPurchaseConfirmationToCustomer } from '../services/emailService.js'
import Product from '../models/Product.js'

// Objeto temporal para guardar datos de preferencias
// En producción, esto debería estar en una base de datos
const pendingOrders = new Map()

// ===============================
// CREATE PREFERENCE (Compra simple de producto individual)
// ===============================
export const createPreference = async (req, res) => {
    try {
        const { title, unit_price, quantity, buyer_email, buyer_phone } = req.body

        if (!buyer_email || !buyer_phone) {
            return res.status(400).json({ error: 'Email y teléfono son requeridos' })
        }

        const preference = new Preference(client)

        const result = await preference.create({
            body: {
                items: [
                    {
                        title,
                        unit_price: Number(unit_price),
                        quantity: Number(quantity),
                        currency_id: 'ARS',
                    },
                ],
                payer: {
                    email: buyer_email,
                    phone: {
                        area_code: '',
                        number: String(buyer_phone),
                    },
                },
                back_urls: {
                    success: `${process.env.FRONTEND_URL}/pay-correct`,
                    failure: `${process.env.FRONTEND_URL}/pay-fail`,
                    pending: `${process.env.FRONTEND_URL}/pay-fail`,
                },
                auto_return: 'approved',
                notification_url: `${process.env.BACKEND_URL}/webhook/mercadopago`,
            },
        })

        // Guardar datos del comprador asociados al preference_id
        pendingOrders.set(result.id, {
            buyer_email,
            buyer_phone,
            title,
            unit_price: Number(unit_price),
            quantity: Number(quantity),
            created_at: new Date(),
        })

        console.log(`✅ Preferencia creada: ${result.id} para ${buyer_email}`)

        res.json({
            id: result.id,
            init_point: result.init_point,
            sandbox_init_point: result.sandbox_init_point,
        })
    } catch (error) {
        console.error('❌ Error creando preferencia:', error)
        res.status(500).json({
            error: 'Error creando preferencia',
            details: error.message || error,
        })
    }
}

// ===============================
// CREATE CHECKOUT (Compra de carrito con múltiples productos)
// ===============================
export const createCheckout = async (req, res) => {
    try {
        const { items, buyer_email, buyer_phone } = req.body

        if (!buyer_email || !buyer_phone) {
            return res.status(400).json({ error: 'Email y teléfono son requeridos' })
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' })
        }

        // Obtener productos
        const productIds = items.map(i => i.product_id)
        const products = await Product.find({ _id: { $in: productIds } })

        if (products.length !== items.length) {
            return res.status(404).json({ error: 'Producto inexistente' })
        }

        // Verificar stock
        for (const item of items) {
            const product = products.find(p => p._id.toString() === item.product_id)

            if (!product || product.stock < item.quantity) {
                return res.status(400).json({
                    error: `Stock insuficiente para ${product?.name || 'producto'}`
                })
            }
        }

        // Items Mercado Pago
        const mpItems = items.map(item => {
            const product = products.find(p => p._id.toString() === item.product_id)

            return {
                id: product._id.toString(),
                title: product.name,
                description: product.description || 'Producto',
                picture_url: product.image || undefined,
                category_id: 'electronics',
                quantity: Number(item.quantity),
                unit_price: Number(product.price),
                currency_id: 'ARS'
            }
        })

        const preference = new Preference(client)

        const result = await preference.create({
            body: {
                items: mpItems,

                payer: {
                    email: buyer_email,
                    phone: {
                        area_code: '',
                        number: String(buyer_phone),
                    },
                },

                back_urls: {
                    success: `${process.env.FRONTEND_URL}/pay-correct`,
                    failure: `${process.env.FRONTEND_URL}/pay-fail`,
                    pending: `${process.env.FRONTEND_URL}/pay-fail`
                },

                auto_return: 'approved',

                statement_descriptor: 'MP COMPONENTES',

                payment_methods: {
                    excluded_payment_methods: [],
                    excluded_payment_types: [],
                    installments: 12
                },

                shipments: {
                    mode: 'not_specified'
                },

                metadata: {
                    cart: items.map(i => ({
                        product_id: i.product_id,
                        quantity: i.quantity
                    })),
                    buyer_phone: buyer_phone
                },

                notification_url: `${process.env.BACKEND_URL}/webhook/mercadopago`
            }
        })

        res.json({
            url: result.init_point,
            preferenceId: result.id
        })

    } catch (error) {
        console.error('❌ Checkout error:', error)
        res.status(500).json({ error: 'Error creando checkout' })
    }
}

// ===============================
// HANDLE WEBHOOK
// ===============================
export const handleWebhook = async (req, res) => {
    try {
        console.log('📩 Query params:', req.query)
        console.log('📩 Body:', req.body)

        let paymentId = null

        // Detectar formato del webhook (v1 o v0)
        if (req.body.type === 'payment' && req.body.data?.id) {
            paymentId = req.body.data.id
            console.log('✅ Webhook v1 detectado - Payment ID:', paymentId)
        } else if (req.query.topic === 'payment' && req.query.id) {
            paymentId = req.query.id
            console.log('✅ Webhook v0 detectado - Payment ID:', paymentId)
        } else if (req.query['data.id'] && req.query.topic === 'payment') {
            paymentId = req.query['data.id']
            console.log('✅ Webhook alternativo detectado - Payment ID:', paymentId)
        } else {
            console.log('ℹ️ Webhook ignorado (no es payment o falta ID)')
            return res.sendStatus(200)
        }

        if (paymentId) {
            const payment = new Payment(client)
            const paymentData = await payment.get({ id: paymentId })

            console.log('💳 Estado del pago:', paymentData.status)

            if (paymentData.status === 'approved') {
                const buyerEmail = paymentData.payer?.email
                const buyerPhone = paymentData.metadata?.buyer_phone || 
                                  paymentData.additional_info?.payer?.phone?.number || 
                                  'No proporcionado'

                // Si viene del carrito (metadata.cart existe)
                if (paymentData.metadata?.cart) {
                    const items = paymentData.metadata.cart
                    const purchasedItems = []
                    let total = 0

                    for (const item of items) {
                        const product = await Product.findByIdAndUpdate(
                            item.product_id,
                            { $inc: { stock: -item.quantity } },
                            { new: true }
                        )

                        if (!product) continue

                        purchasedItems.push({
                            product_name: product.name,
                            quantity: item.quantity,
                            price: product.price
                        })

                        total += product.price * item.quantity
                    }

                    const purchaseData = {
                        items: purchasedItems,
                        buyer_email: buyerEmail,
                        buyer_phone: buyerPhone,
                        total,
                        payment_id: paymentData.id
                    }

                    await sendPurchaseNotificationToStore(purchaseData)
                    await sendPurchaseConfirmationToCustomer(purchaseData)

                    console.log('✅ Emails enviados para compra de carrito')
                } else {
                    // Compra simple (createPreference)
                    const preferenceId = paymentData.external_reference
                    const savedData = pendingOrders.get(preferenceId)

                    const productTitle = savedData?.title || paymentData.description || 'Producto'
                    const quantity = savedData?.quantity || 1
                    const unitPrice = savedData?.unit_price || (paymentData.transaction_amount / quantity)
                    const totalAmount = paymentData.transaction_amount

                    const purchaseData = {
                        items: [{
                            product_name: productTitle,
                            quantity: quantity,
                            price: unitPrice
                        }],
                        buyer_email: buyerEmail,
                        buyer_phone: buyerPhone,
                        total: totalAmount,
                        payment_id: paymentData.id
                    }

                    await sendPurchaseNotificationToStore(purchaseData)
                    await sendPurchaseConfirmationToCustomer(purchaseData)

                    console.log('✅ Emails enviados para compra simple')

                    // Limpiar datos guardados después de usarlos
                    if (savedData) {
                        pendingOrders.delete(preferenceId)
                        console.log(`🗑️ Datos de preferencia ${preferenceId} eliminados`)
                    }
                }
            }
        }

        res.sendStatus(200)
    } catch (error) {
        console.error('❌ Error en webhook:', error)
        res.sendStatus(200)
    }
}