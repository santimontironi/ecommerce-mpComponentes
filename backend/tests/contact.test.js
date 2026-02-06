import { sendContactMessage } from "../controllers/contact-controller.js";
import mail_transporter from "../config/nodemailer_config.js";

jest.mock("../config/nodemailer_config.js");

// ============================================================================
// TEST: CONTACTO - ENVÍO DE MENSAJES
// ============================================================================

describe("Test unitarios del Contact Controller", () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {
                name: "John",
                surname: "Doe",
                email: "john.doe@example.com",
                phone: "123456789",
                message: "This is a test message"
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Debería enviar un correo de contacto correctamente", async () => {
        mail_transporter.sendMail.mockResolvedValue({ response: "Email sent" });

        await sendContactMessage(req, res);

        expect(mail_transporter.sendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                from: expect.any(String),
                to: expect.any(String),
                subject: expect.any(String),
                text: expect.stringContaining("John")
            })
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Mensaje enviado correctamente" });
    });

    test("Debería manejar errores al enviar un correo de contacto", async () => {
        const error = new Error("Error al enviar el correo");
        mail_transporter.sendMail.mockRejectedValue(error);

        await sendContactMessage(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 
            message: "Error al enviar el mensaje", 
            error: error.message 
        });
    });
})