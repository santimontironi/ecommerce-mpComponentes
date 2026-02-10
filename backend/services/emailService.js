import mail_transporter from "../config/nodemailer_config.js";
import dotenv from "dotenv";

dotenv.config()

// Enviar email a la tienda cuando hay una nueva compra
export const sendPurchaseNotificationToStore = async (purchaseData) => {
    console.log('📧 Intentando enviar email a la tienda...')
    console.log('📦 Datos de compra:', JSON.stringify(purchaseData, null, 2))

    try {
        const { items, buyer_email, buyer_phone, total, payment_id } = purchaseData

        // ✅ Validación de datos
        if (!items || items.length === 0) {
            console.error('❌ No hay items para enviar')
            return false
        }

        if (!buyer_email) {
            console.error('❌ No hay email del comprador')
            return false
        }

        console.log('📋 Items a enviar:', items)

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
            from: process.env.EMAIL_USER, // 🔥 CAMBIO: Usa EMAIL_USER como from
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
                        <p><strong>Teléfono:</strong> ${buyer_phone || 'No proporcionado'}</p>
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

        console.log('📮 Enviando email con opciones:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject
        })

        const result = await mail_transporter.sendMail(mailOptions)

        console.log('✅ Email enviado exitosamente a la tienda:', result.messageId)
        return true

    } catch (error) {
        console.error('❌ Error enviando email a la tienda:', error.message)
        console.error('❌ Stack completo:', error)
        return false
    }
}

// Enviar email de confirmación al cliente
export const sendPurchaseConfirmationToCustomer = async (purchaseData) => {
    console.log('📧 Intentando enviar email al cliente...')

    try {
        const { items, buyer_email, total } = purchaseData

        // ✅ Validación
        if (!buyer_email) {
            console.error('❌ No hay email del comprador para enviar confirmación')
            return false
        }

        if (!items || items.length === 0) {
            console.error('❌ No hay items para enviar al cliente')
            return false
        }

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

        console.log('📮 Enviando email al cliente:', buyer_email)

        const result = await mail_transporter.sendMail(mailOptions)

        console.log('✅ Email enviado exitosamente al cliente:', result.messageId)
        return true

    } catch (error) {
        console.error('❌ Error enviando email al cliente:', error.message)
        console.error('❌ Stack completo:', error)
        return false
    }
}

// Enviar email a la tienda cuando hay una nueva reserva
export const sendReservationNotificationToStore = async (reservationData) => {
    try {
        const { product_name, quantity, unit_price, total_amount, deposit_amount, buyer_email, reservation_id, expiration_date, payment_id } = reservationData;

        const mailOptions = {
            from: buyer_email,
            to: process.env.EMAIL_USER,
            subject: `📦 Nueva reserva - ${reservation_id}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #2196F3; padding-bottom: 10px;">
                        Nueva Reserva Recibida
                    </h2>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>ID de reserva:</strong> ${reservation_id}</p>
                        <p><strong>Cliente:</strong> ${buyer_email}</p>
                        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-AR')}</p>
                        <p><strong>Vence:</strong> ${new Date(expiration_date).toLocaleDateString('es-AR')}</p>
                    </div>
                    <h3 style="color: #555;">Producto reservado:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #2196F3; color: white;">
                                <th style="padding: 10px; text-align: left;">Producto</th>
                                <th style="padding: 10px; text-align: center;">Cantidad</th>
                                <th style="padding: 10px; text-align: right;">Precio Unit.</th>
                                <th style="padding: 10px; text-align: right;">Total</th>
                                <th style="padding: 10px; text-align: right;">Seña (30%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${product_name}</td>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${quantity}</td>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${unit_price.toLocaleString('es-AR')}</td>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${total_amount.toLocaleString('es-AR')}</td>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; color: #2196F3; font-weight: bold;">$${deposit_amount.toLocaleString('es-AR')}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="margin-top: 30px; padding: 15px; background-color: #e3f2fd; border-left: 4px solid #2196F3;">
                        <p style="margin: 0; color: #1565c0;">
                            <strong>Acción requerida:</strong> Confirmar la reserva y coordinar el pago final.
                        </p>
                    </div>
                </div>
            `,
        };
        await mail_transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('❌ Error enviando email de reserva a la tienda:', error);
        return false;
    }
};

// Enviar email de confirmación de reserva al cliente
export const sendReservationConfirmationToCustomer = async (reservationData) => {
    try {
        const { product_name, quantity, unit_price, total_amount, deposit_amount, buyer_email, expiration_date, reservation_id } = reservationData;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: buyer_email,
            subject: '✅ Confirmación de reserva',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2196F3;">¡Reserva realizada con éxito!</h2>
                    <p>Tu reserva ha sido registrada. Recuerda que tienes hasta el <strong>${new Date(expiration_date).toLocaleDateString('es-AR')}</strong> para completar el pago final.</p>
                    <h3>Detalle de la reserva:</h3>
                    <ul style="line-height: 1.8;">
                        <li><strong>Producto:</strong> ${product_name}</li>
                        <li><strong>Cantidad:</strong> ${quantity}</li>
                        <li><strong>Precio unitario:</strong> $${unit_price.toLocaleString('es-AR')}</li>
                        <li><strong>Total:</strong> $${total_amount.toLocaleString('es-AR')}</li>
                        <li><strong>Seña pagada (30%):</strong> $${deposit_amount.toLocaleString('es-AR')}</li>
                    </ul>
                    <p style="color: #666; margin-top: 30px;">
                        Si tienes dudas, responde a este email o comunícate con la tienda.
                    </p>
                </div>
            `,
        };
        await mail_transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('❌ Error enviando email de reserva al cliente:', error);
        return false;
    }
};