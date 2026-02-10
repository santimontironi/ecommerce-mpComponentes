import client from '../config/mercadopagoConfig.js'
import { Preference, Payment } from 'mercadopago'
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

        // Crea una instancia de Preference
        const preference = new Preference(client)

        // Crea la preferencia de pago en MercadoPago
        const result = await preference.create({
            body: {
                // Productos que se van a pagar
                items: items.map(item => ({
                    title: item.title,
                    description: item.title,
                    quantity: parseInt(item.quantity),
                    unit_price: parseFloat(item.unit_price),
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
                    buyer_phone
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
        // Variable donde se guardará el ID del pago
        let paymentId = null

        // Webhook versión nueva (POST con body)
        if (req.body?.type === 'payment' && req.body?.data?.id) {
            paymentId = req.body.data.id
        }
        // Webhook versión antigua (GET con query)
        else if (req.query?.topic === 'payment' && req.query?.id) {
            paymentId = req.query.id
        }
        // Si no es un evento de pago, se responde OK
        else {
            return res.sendStatus(200)
        }

        // Crea instancia de Payment para consultar el pago real
        const payment = new Payment(client)

        // Obtiene los datos reales del pago desde MercadoPago
        const paymentData = await payment.get({ id: paymentId })


        if (paymentData.status !== 'approved' && paymentData.status !== 'in_process') {
            console.log(`⚠️ Pago no aprobado: ${paymentData.status} - ${paymentData.status_detail}`)
            return res.sendStatus(200)
        }

        // Construye los datos de la compra confirmada
        const purchaseData = {
            items: [
                {
                    product_name: paymentData.description || 'Producto',
                    quantity: paymentData.additional_info?.items?.[0]?.quantity || 1,
                    price: paymentData.transaction_amount
                }
            ],
            buyer_email: paymentData.metadata?.buyer_email,
            buyer_phone: paymentData.metadata?.buyer_phone,
            total: paymentData.transaction_amount,
            payment_id: paymentData.id
        }

        // Envía email a la tienda
        await sendPurchaseNotificationToStore(purchaseData)

        // Envía email de confirmación al cliente
        await sendPurchaseConfirmationToCustomer(purchaseData)

        // Log de éxito
        console.log('📧 Emails enviados correctamente')

        // Responde OK a MercadoPago
        res.sendStatus(200)

    } catch (error) {
        // Log del error del webhook
        console.error('❌ Error webhook:', error)

        // Siempre responder 200 para evitar reintentos infinitos
        res.sendStatus(200)
    }
}
