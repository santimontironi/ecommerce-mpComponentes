import stripe from '../config/stripe.js'
import Product from '../models/Product.js'
import { sendPurchaseConfirmationToCustomer } from '../services/emailService.js'
import { sendPurchaseNotificationToStore } from '../services/emailService.js'

// Crear checkout con múltiples productos
export const createCheckout = async (req, res) => {
    try {
        const { items, buyer_email } = req.body

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

        // Crear line_items para Stripe
        const lineItems = items.map(item => {
            const product = products.find(p => p._id.toString() === item.product_id)

            return {
                price_data: {
                    currency: 'ars',
                    product_data: {
                        name: product.name,
                        description: product.description
                    },
                    unit_amount: Math.round(product.price * 100)
                },
                quantity: item.quantity
            }
        })

        // Crear sesión de Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/pay-correct?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/pay-fail`,
            customer_email: buyer_email,
            metadata: {
                items: JSON.stringify(items) // Guardamos los items como string
            }
        })

        res.json({
            url: session.url,
            sessionId: session.id
        })

    } catch (error) {
        console.error('❌ Error:', error)
        res.status(500).json({ error: error.message })
    }
}

export const handleWebhook = async (req, res) => {
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

        console.log('✅ Pago completado:', session.id)

        try {
            const items = JSON.parse(session.metadata.items)
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

                // Guardar info para el email
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
                buyer_email: session.customer_email,
                total: total,
                payment_id: session.id
            }

            // 📧 Enviar email a la tienda
            await sendPurchaseNotificationToStore(purchaseData)

            // 📧 Enviar email de confirmación al cliente (opcional)
            await sendPurchaseConfirmationToCustomer(purchaseData)

        } catch (error) {
            console.error('❌ Error procesando pago:', error)
        }
    }

    res.json({ received: true })
}