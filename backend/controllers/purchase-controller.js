import { Preference, Payment } from 'mercadopago'
import client from '../config/mercadopagoConfig.js'
import {
  sendPurchaseNotificationToStore,
  sendPurchaseConfirmationToCustomer
} from '../services/emailService.js'

// =====================================
// CREATE PREFERENCE (MINIMAL + LOGS)
// =====================================
export const createPreference = async (req, res) => {
  try {
    console.log('📥 createPreference body:', req.body)

    const {
      title,
      unit_price,
      quantity,
      buyer_email,
      buyer_phone
    } = req.body

    if (!buyer_email || !buyer_phone) {
      console.log('❌ Faltan datos obligatorios')
      return res.status(400).json({
        error: 'Email y teléfono requeridos'
      })
    }

    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: [
          {
            title,
            quantity: Number(quantity),
            unit_price: Number(unit_price),
            currency_id: 'ARS'
          }
        ],

        payer: {
          email: buyer_email,
          phone: {
            area_code: '',
            number: String(buyer_phone)
          }
        },

        back_urls: {
          success: `${process.env.FRONTEND_URL}/pay-correct`,
          failure: `${process.env.FRONTEND_URL}/pay-fail`,
          pending: `${process.env.FRONTEND_URL}/pay-pending`
        },

        auto_return: 'approved'
      }
    })

    console.log('✅ Preferencia creada:', {
      id: result.id,
      init_point: result.init_point
    })

    res.json({
      id: result.id,
      init_point: result.init_point
    })

  } catch (error) {
    console.error('❌ Error creando preferencia:', error)
    res.status(500).json({ error: 'Error creando preferencia' })
  }
}

// =====================================
// WEBHOOK (MINIMAL + LOGS + MAILS)
// =====================================
export const handleWebhook = async (req, res) => {
  try {
    console.log('🔔 Webhook recibido')
    console.log('📩 Query:', req.query)
    console.log('📦 Body:', req.body)

    let paymentId = null

    if (req.body?.type === 'payment' && req.body?.data?.id) {
      paymentId = req.body.data.id
      console.log('🆔 Webhook v1 → paymentId:', paymentId)
    } else if (req.query?.topic === 'payment' && req.query?.id) {
      paymentId = req.query.id
      console.log('🆔 Webhook v0 → paymentId:', paymentId)
    } else {
      console.log('ℹ️ Webhook ignorado (no es payment)')
      return res.sendStatus(200)
    }

    const payment = new Payment(client)
    const paymentData = await payment.get({ id: paymentId })

    console.log('💳 Estado:', paymentData.status)
    console.log('💰 Monto:', paymentData.transaction_amount)
    console.log('📧 Email:', paymentData.payer?.email)
    console.log('📱 Phone:', paymentData.payer?.phone)
    console.log('📦 additional_info:', paymentData.additional_info)

    if (paymentData.status !== 'approved') {
      console.log('⏳ Pago no aprobado todavía')
      return res.sendStatus(200)
    }

    const purchaseData = {
      items: [
        {
          product_name: paymentData.description || 'Producto',
          quantity: paymentData.additional_info?.items?.[0]?.quantity || 1,
          price: paymentData.transaction_amount || 0
        }
      ],
      buyer_email: paymentData.payer?.email,
      buyer_phone: paymentData.payer?.phone?.number || 'No informado',
      total: paymentData.transaction_amount,
      payment_id: paymentData.id
    }

    console.log('📨 Datos preparados para email:', purchaseData)

    await sendPurchaseNotificationToStore(purchaseData)
    console.log('✅ Mail enviado a la tienda')

    await sendPurchaseConfirmationToCustomer(purchaseData)
    console.log('✅ Mail enviado al cliente')

    res.sendStatus(200)

  } catch (error) {
    console.error('❌ Error en webhook:', error)
    res.sendStatus(200)
  }
}