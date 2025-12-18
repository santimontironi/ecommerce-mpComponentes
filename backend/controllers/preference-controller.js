import { Preference } from 'mercadopago';
import client from '../config/mpConfig.js';

export const createPreference = async (req, res) => {
    try {
        const {
            title,
            unit_price,
            quantity,
            buyer_email,
            buyer_phone,
            buyer_address
        } = req.body;

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: [
                    {
                        title,
                        unit_price: Number(unit_price),
                        quantity: Number(quantity),
                        currency_id: 'ARS',
                    },
                ],
                payer: {
                    email: buyer_email,
                    phone: {
                        number: String(buyer_phone),
                    },
                    address: {
                        street_name: buyer_address,
                    },
                },
                back_urls: {
                    success: 'http://localhost:5173/pay-correct',
                    failure: 'http://localhost:5173/pay-fail',
                    pending: 'http://localhost:5173/pay-pending',
                },
                auto_return: 'approved',
            },
        });

        console.log(`✅ Preferencia creada: ${result.id}`);

        res.status(200).json({
            id: result.id,
            init_point: result.init_point,
            sandbox_init_point: result.sandbox_init_point,
        });
    } catch (error) {
        console.error('❌ Error creando preferencia:', error);
        res.status(500).json({
            message: 'Error al crear la preferencia de pago',
            error: error.message,
        });
    }
};