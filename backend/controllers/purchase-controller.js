import { Preference, Payment } from 'mercadopago'
import client from '../config/mercadopagoConfig.js'
import {
  sendPurchaseNotificationToStore,
  sendPurchaseConfirmationToCustomer
} from '../services/emailService.js'

// ===============================
// CREATE PREFERENCE
// ===============================
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
          email: buyer_email
        },

        metadata: {
          buyer_email,
          buyer_phone
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

// ===============================
// WEBHOOK MERCADOPAGO
// ===============================
export const handleWebhook = async (req, res) => {
  try {
    console.log('🔔 Webhook recibido')
    console.log('Headers:', req.headers['content-type'])
    console.log('Query:', req.query)
    console.log('Body:', req.body)

    let paymentId = null

    // Webhook v1
    if (req.body?.type === 'payment' && req.body?.data?.id) {
      paymentId = req.body.data.id
    }
    // Webhook v0
    else if (req.query?.topic === 'payment' && req.query?.id) {
      paymentId = req.query.id
    }
    else {
      return res.sendStatus(200)
    }

    const payment = new Payment(client)
    const paymentData = await payment.get({ id: paymentId })

    console.log('💰 Estado pago:', paymentData.status)

    if (paymentData.status !== 'approved') {
      return res.sendStatus(200)
    }

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

    await sendPurchaseNotificationToStore(purchaseData)
    await sendPurchaseConfirmationToCustomer(purchaseData)

    console.log('📧 Emails enviados correctamente')

    res.sendStatus(200)

  } catch (error) {
    console.error('❌ Error webhook:', error)
    res.sendStatus(200)
  }
}