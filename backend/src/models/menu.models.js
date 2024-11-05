import mongoose, { Schema } from "mongoose"

const menuItemReviewSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    review: {
        type: String,
    },
}, { timestamps: true })

const menuSchema = new Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    image: [{
        publicId: {
            type: String,
        },
        url: {
            type: String,
        },
    }],
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        enum: ['starters', 'Rice', 'breads', 'drinks', 'desserts', 'mainCourse'],
        required: true,
    },
    reviews: [menuItemReviewSchema],
    isVeg: {
        type: Boolean,
        required: true,
        default: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
        required: true,
    },

}, { timestamps: true })

export const Menu = mongoose.model("Menu", menuSchema)