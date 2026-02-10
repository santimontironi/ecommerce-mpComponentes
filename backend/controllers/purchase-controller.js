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
                    buyer_phone,
                    items: JSON.stringify(items) // Guardar items para recuperar en webhook
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
    console.log('=' .repeat(50))
    console.log('🔔 WEBHOOK LLAMADO')
    console.log('Timestamp:', new Date().toISOString())
    console.log('=' .repeat(50))

    try {
        let paymentId = null

        if (req.body?.type === 'payment' && req.body?.data?.id) {
            paymentId = req.body.data.id
        }
        else if (req.query?.topic === 'payment' && req.query?.id) {
            paymentId = req.query.id
        }
        else {
            console.log('⚠️ No es notificación de pago')
            return res.sendStatus(200)
        }

        console.log('💰 Payment ID:', paymentId)

        const payment = new Payment(client)
        const paymentData = await payment.get({ id: paymentId })

        console.log('📊 Estado del pago:', {
            id: paymentData.id,
            status: paymentData.status,
            status_detail: paymentData.status_detail,
            amount: paymentData.transaction_amount,
            description: paymentData.description,
            metadata: paymentData.metadata,
            payer_email: paymentData.payer?.email,
            additional_info: paymentData.additional_info
        })

        if (paymentData.status !== 'approved') {
            console.log(`⚠️ Pago no aprobado: ${paymentData.status}`)
            return res.sendStatus(200)
        }

        // 🔥 Recuperar items desde metadata
        let items = []
        try {
            console.log('🔍 Metadata completo:', JSON.stringify(paymentData.metadata, null, 2))
            
            if (paymentData.metadata?.items) {
                console.log('📝 Items raw en metadata:', paymentData.metadata.items)
                const parsedItems = JSON.parse(paymentData.metadata.items)
                console.log('✅ Items parseados:', JSON.stringify(parsedItems, null, 2))
                
                items = parsedItems.map(item => ({
                    product_name: item.title,
                    quantity: item.quantity,
                    price: item.unit_price
                }))
                console.log('✅ Items mapeados:', JSON.stringify(items, null, 2))
            } else {
                console.log('⚠️ paymentData.metadata.items es:', paymentData.metadata?.items)
            }
        } catch (parseError) {
            console.error('⚠️ Error parseando items de metadata:', parseError.message)
            console.error('⚠️ Stack:', parseError.stack)
        }

        // Fallback si no hay items en metadata
        if (!items || items.length === 0) {
            console.log('⚠️ No hay items en metadata, usando fallback')
            items = [{
                product_name: paymentData.description || 'Producto',
                quantity: 1,
                price: paymentData.transaction_amount
            }]
        }

        const purchaseData = {
            items,
            buyer_email: paymentData.metadata?.buyer_email || paymentData.payer?.email,
            buyer_phone: paymentData.metadata?.buyer_phone || paymentData.payer?.phone?.number,
            total: paymentData.transaction_amount,
            payment_id: paymentData.id
        }

        console.log('📦 Purchase data construido:', JSON.stringify(purchaseData, null, 2))

        console.log('📧 Enviando emails...')
        
        const storeEmailSent = await sendPurchaseNotificationToStore(purchaseData)
        console.log('📧 Email a tienda:', storeEmailSent ? '✅ Enviado' : '❌ Falló')
        
        const customerEmailSent = await sendPurchaseConfirmationToCustomer(purchaseData)
        console.log('📧 Email a cliente:', customerEmailSent ? '✅ Enviado' : '❌ Falló')

        console.log('=' .repeat(50))
        res.sendStatus(200)

    } catch (error) {
        console.error('❌ ERROR EN WEBHOOK:', error.message)
        console.error('❌ Stack:', error.stack)
        res.sendStatus(200)
    }
}
