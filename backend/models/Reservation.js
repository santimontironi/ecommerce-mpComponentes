import mongoose from "mongoose";

const reservationSchema = mongoose.Schema({
    user_email: {
        type: String,
        required: true,
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    total_amount: {
        type: Number,
        required: true // precio * cantidad
    },
    deposit_amount: {
        type: Number,
        required: true // 30% del total_amount
    },
    status: {
        type: String,
        enum: ['pending', 'deposit_paid', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    stripe_session_id: String,
    stripe_payment_intent_id: String,
    expiration_date: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días desde ahora
    },
    notes: String
}, {
    timestamps: true
})

export default mongoose.model("Reservation", reservationSchema);
