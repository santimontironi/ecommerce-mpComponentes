import mail_transporter from "../config/nodemailer_config";

export const sendContactMessage = async (req,res) => {
    try{
        const {name, surname, email, phone, message} = req.body

        const mailOptions = {
            from: email,
            to: process.env.EMAIL,
            subject: "Nuevo mensaje de contacto",
            text: `Nombre: ${name} ${surname}\nEmail: ${email}\nTelefono: ${phone}\nMensaje: ${message}`
        }

        await mail_transporter.sendMail(mailOptions);

        res.status(200).json({message:"Mensaje enviado correctamente"});
    }
    catch(error){
        res.status(500).json({message:"Error al enviar el mensaje", error: error.message});
    }
}