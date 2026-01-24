import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY no está definida en las variables de entorno')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default stripe