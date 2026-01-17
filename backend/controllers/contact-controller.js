import mail_transporter from "../config/nodemailer_config.js";

export const sendContactMessage = async (req, res) => {
    try {
        const { name, surname, email, phone, message } = req.body

        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: "📧 Nuevo mensaje de contacto",
            html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
                    
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        
                        <div style="background: linear-gradient(135deg, #3b82f6, #06b6d4); padding: 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px;">
                                📬 Nuevo Mensaje de Contacto
                            </h1>
                        </div>
                        
                        <div style="padding: 30px;">
                            
                            <div style="margin-bottom: 20px;">
                                <p style="margin: 0; color: #666; font-size: 12px; font-weight: bold; text-transform: uppercase;">Nombre Completo</p>
                                <p style="margin: 5px 0 0 0; color: #333; font-size: 16px;">${name} ${surname}</p>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <p style="margin: 0; color: #666; font-size: 12px; font-weight: bold; text-transform: uppercase;">Email</p>
                                <p style="margin: 5px 0 0 0;">
                                    <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
                                </p>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <p style="margin: 0; color: #666; font-size: 12px; font-weight: bold; text-transform: uppercase;">Teléfono</p>
                                <p style="margin: 5px 0 0 0;">
                                    <a href="tel:${phone}" style="color: #3b82f6; text-decoration: none;">${phone}</a>
                                </p>
                            </div>
                            
                            <div style="margin-top: 30px; padding: 20px; background-color: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 4px;">
                                <p style="margin: 0 0 10px 0; color: #666; font-size: 12px; font-weight: bold; text-transform: uppercase;">Mensaje</p>
                                <p style="margin: 0; color: #333; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                            </div>
                            
                        </div>
                        
                        <div style="padding: 20px; background-color: #f8fafc; border-top: 1px solid #e5e7eb; text-align: center;">
                            <p style="margin: 0; color: #999; font-size: 13px;">
                                Enviado desde el formulario de contacto
                            </p>
                            <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">
                                ${new Date().toLocaleString('es-AR', { dateStyle: 'long', timeStyle: 'short' })}
                            </p>
                        </div>
                        
                    </div>
                    
                </body>
                </html>
            `,
            text: `
            Nuevo mensaje de contacto

            Nombre: ${name} ${surname}
            Email: ${email}
            Teléfono: ${phone}

            Mensaje:
            ${message}

            ---
            Enviado el ${new Date().toLocaleString('es-AR')}
                        `
        }

        await mail_transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Mensaje enviado correctamente" });
    }
    catch (error) {
        console.error('Error al enviar email:', error);
        res.status(500).json({ message: "Error al enviar el mensaje", error: error.message });
    }
}