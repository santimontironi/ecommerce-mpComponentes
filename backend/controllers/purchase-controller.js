import client from '../config/mercadopagoConfig.js'
import { Preference } from 'mercadopago'
import Product from '../models/Product.js'
import { sendPurchaseConfirmationToCustomer } from '../services/emailService.js'
import { sendPurchaseNotificationToStore } from '../services/emailService.js'


// ===============================
// CREATE CHECKOUT
// ===============================
export const createCheckout = async (req, res) => {
    try {
        const { items, buyer_email, buyer_phone } = req.body

        if (!buyer_email || !buyer_phone) {
            return res.status(400).json({ error: 'Email y teléfono requeridos' })
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' })
        }

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

        const mpItems = items.map(item => {
            const product = products.find(p => p._id.toString() === item.product_id)

            return {
                id: product._id.toString(),
                title: product.name,
                description: product.description || 'Producto',
                picture_url: product.image,
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
                    email: buyer_email
                },

                back_urls: {
                    success: `${process.env.FRONTEND_URL}/pay-correct`,
                    failure: `${process.env.FRONTEND_URL}/pay-fail`,
                    pending: `${process.env.FRONTEND_URL}/pay-pending`
                },

                auto_return: 'approved'
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
            req.body?.data?.id ||
            req.query?.id

        const topic =
            req.body?.type ||
            req.query?.topic

        if (topic !== 'payment' || !paymentId) {
            return res.sendStatus(200)
        }

        const payment = new Payment(client)
        const paymentData = await payment.get({ id: paymentId })

        if (paymentData.status !== 'approved') {
            return res.sendStatus(200)
        }

        const { cart, buyer_email, buyer_phone } = paymentData.metadata

        const purchasedItems = []
        let total = 0

        for (const item of cart) {
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
            buyer_email,
            buyer_phone,
            total,
            payment_id: paymentData.id
        }

        await sendPurchaseNotificationToStore(purchaseData)
        await sendPurchaseConfirmationToCustomer(purchaseData)

        res.sendStatus(200)

    } catch (error) {
        console.error('❌ Webhook error:', error)
        res.sendStatus(200)
    }
}