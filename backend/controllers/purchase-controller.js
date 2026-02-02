import client from '../config/mercadopagoConfig.js'
import { Preference } from 'mercadopago'
import Product from '../models/Product.js'
import { sendPurchaseConfirmationToCustomer } from '../services/emailService.js'
import { sendPurchaseNotificationToStore } from '../services/emailService.js'

// Crear checkout con múltiples productos
import client from '../config/mercadopagoConfig.js'
import { Preference } from 'mercadopago'
import Product from '../models/Product.js'
import {
    sendPurchaseConfirmationToCustomer,
    sendPurchaseNotificationToStore
} from '../services/emailService.js'

// ===============================
// CREATE CHECKOUT
// ===============================
export const createCheckout = async (req, res) => {
    try {
        const { items, buyer_email } = req.body

        if (!buyer_email) {
            return res.status(400).json({ error: 'Email requerido' })
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
                title: product.name,
                unit_price: Number(product.price),
                quantity: Number(item.quantity),
                currency_id: 'ARS'
            }
        })

        const preference = new Preference(client)

        const result = await preference.create({
            body: {
                items: mpItems,

                payer: {
                    email: buyer_email
                },

                back_urls: {
                    success: `${process.env.FRONTEND_URL}/pay-success`,
                    failure: `${process.env.FRONTEND_URL}/pay-failure`,
                    pending: `${process.env.FRONTEND_URL}/pay-pending`
                },

                auto_return: 'approved',

                statement_descriptor: 'MP COMPONENTES',

                metadata: {
                    cart: items.map(i => ({
                        product_id: i.product_id,
                        quantity: i.quantity
                    }))
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

export const handleWebhook = async (req, res) => {
    try {
        const paymentId =
            req.query['data.id'] ||
            req.body?.data?.id

        const topic =
            req.query.topic ||
            req.body?.type

        if (topic !== 'payment' || !paymentId) {
            return res.sendStatus(200)
        }

        const response = await fetch(
            `https://api.mercadopago.com/v1/payments/${paymentId}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
                }
            }
        )

        const payment = await response.json()

        if (payment.status !== 'approved') {
            return res.sendStatus(200)
        }

        const items = payment.metadata.cart
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
            buyer_email: payment.payer.email,
            total,
            payment_id: payment.id
        }

        await sendPurchaseNotificationToStore(purchaseData)
        await sendPurchaseConfirmationToCustomer(purchaseData)

        res.sendStatus(200)

    } catch (error) {
        console.error('❌ Webhook error:', error)
        res.sendStatus(500)
    }
}