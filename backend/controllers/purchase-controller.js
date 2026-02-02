import stripe from '../config/stripeConfig.js'
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
        // Busca todos los productos de una vez
        // products = [
        //   { _id: '123abc', name: 'Zapatillas', price: 50000, stock: 10 },
        //   { _id: '456def', name: 'Remera', price: 20000, stock: 5 }
        // ]

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

        // Crear line_items para Stripe, esto le dice a Stripe qué productos mostrar en el checkout
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

        // Crear sesión de Stripe, Stripe crea una sesión temporal de pago
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',

            // URLs temporales (pueden no existir aún)
            success_url: 'http://localhost:5173/pay-correct?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:5173/pay-fail',

            customer_email: buyer_email,
            metadata: {
                items: JSON.stringify(items),
                buyer_phone: buyer_phone || ''
            }
        })

        res.json({
            url: session.url,  // URL de la página de pago
            sessionId: session.id // ID de la sesión
        })

    } catch (error) {
        console.error('❌ Error:', error)
        res.status(500).json({ error: error.message })
    }
}

//Cuando Stripe confirma que el pago fue exitoso, Stripe automáticamente hace un POST a tu servidor y se ejecuta el webhook.
export const handleWebhook = async (req, res) => {

    // firma de seguridad para verificar que viene de Stripe
    const sig = req.headers['stripe-signature']
    let event

    try {
        event = stripe.webhooks.constructEvent(
            req.body, // El cuerpo del mensaje
            sig, // La firma
            process.env.STRIPE_WEBHOOK_SECRET // Tu clave secreta
        )
    } catch (err) {
        console.error('⚠️ Webhook error:', err.message)
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Este evento significa: "El pago se completó exitosamente"
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object

        // session = {
        //   id: 'cs_test_abc123',
        //   customer_email: 'cliente@gmail.com',
        //   amount_total: 12000000, // en centavos
        //   metadata: {
        //     items: '[{"product_id":"123abc","quantity":2},...]'
        //   }
        // }

        console.log('✅ Pago completado:', session.id)

        try {
            const items = JSON.parse(session.metadata.items)
            // items = [
            //   { product_id: '123abc', quantity: 2 },
            //   { product_id: '456def', quantity: 1 }
            // ]

            //Preparar array y variable para guardar info:
            const purchasedItems = []
            let total = 0

            // Decrementar stock y recopilar info de productos
            for (const item of items) {
                const product = await Product.findByIdAndUpdate(
                    item.product_id, // Buscar el producto por su ID
                    { $inc: { stock: -parseInt(item.quantity) } }, // Decrementar stock
                    { new: true } // Devolver el producto actualizado
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

    // Esto le dice a Stripe: "OK, ya lo procesé, no me lo vuelvas a enviar"
    res.json({ received: true })
}