import { MercadoPagoConfig } from 'mercadopago'

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN no está definida en las variables de entorno')
}

const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
})

console.log('✅ MercadoPagoConfig inicializado correctamente')
console.log('🔑 Access Token:', process.env.MERCADOPAGO_ACCESS_TOKEN)
console.log('🔗 Endpoint de MercadoPago:', client.config.baseURL)

export default client