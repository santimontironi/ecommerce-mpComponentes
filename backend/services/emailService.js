import mail_transporter from "../config/nodemailer_config.js";
import dotenv from "dotenv";

dotenv.config()

// Enviar email a la tienda cuando hay una nueva compra
export const sendPurchaseNotificationToStore = async (purchaseData) => {
    try {
        const { items, buyer_email, total, payment_id } = purchaseData

        // Crear HTML con los productos
        const itemsHTML = items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.product_name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toLocaleString('es-AR')}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toLocaleString('es-AR')}</td>
            </tr>
        `).join('')

        const mailOptions = {
            from: buyer_email,
            to: process.env.EMAIL_USER,
            subject: `🛒 Nueva compra - ${payment_id}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
                        Nueva Compra Recibida
                    </h2>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>ID de pago:</strong> ${payment_id}</p>
                        <p><strong>Cliente:</strong> ${buyer_email}</p>
                        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-AR')}</p>
                    </div>

                    <h3 style="color: #555;">Productos:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #4CAF50; color: white;">
                                <th style="padding: 10px; text-align: left;">Producto</th>
                                <th style="padding: 10px; text-align: center;">Cantidad</th>
                                <th style="padding: 10px; text-align: right;">Precio Unit.</th>
                                <th style="padding: 10px; text-align: right;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHTML}
                        </tbody>
                        <tfoot>
                            <tr style="background-color: #f0f0f0; font-weight: bold;">
                                <td colspan="3" style="padding: 10px; text-align: right;">TOTAL:</td>
                                <td style="padding: 10px; text-align: right; color: #4CAF50; font-size: 18px;">
                                    $${total.toLocaleString('es-AR')}
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    <div style="margin-top: 30px; padding: 15px; background-color: #e8f5e9; border-left: 4px solid #4CAF50;">
                        <p style="margin: 0; color: #2e7d32;">
                            <strong>Acción requerida:</strong> Preparar el pedido para envío/entrega.
                        </p>
                    </div>
                </div>
            `,
        }

        await mail_transporter.sendMail(mailOptions)
    
        return true
    } catch (error) {
        console.error('❌ Error enviando email:', error)
        return false
    }
}

// Opcional: Enviar email de confirmación al cliente
export const sendPurchaseConfirmationToCustomer = async (purchaseData) => {
    try {
        const { items, buyer_email, total } = purchaseData

        const itemsHTML = items.map(item => `
            <li>${item.product_name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-AR')}</li>
        `).join('')

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: buyer_email,
            subject: '✅ Confirmación de compra',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4CAF50;">¡Gracias por tu compra!</h2>
                    
                    <p>Tu pedido ha sido confirmado y está siendo procesado.</p>
                    
                    <h3>Resumen de tu pedido:</h3>
                    <ul style="line-height: 1.8;">
                        ${itemsHTML}
                    </ul>
                    
                    <p style="font-size: 18px; font-weight: bold; color: #333;">
                        Total: $${total.toLocaleString('es-AR')}
                    </p>
                    
                    <p style="color: #666; margin-top: 30px;">
                        Te enviaremos otro email cuando tu pedido sea enviado.
                    </p>
                </div>
            `,
        }

        await mail_transporter.sendMail(mailOptions)

        return true
    } catch (error) {
        console.error('❌ Error enviando email al cliente:', error)
        return false
    }
}