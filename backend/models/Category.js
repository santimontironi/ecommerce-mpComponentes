import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model("Category", categorySchema);