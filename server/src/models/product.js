// initialize mongoose
const mongoose = require('mongoose');
// create product schema
const ProductSchema = new mongoose.Schema({
    // userId: {
    //     type: String,
    //     required: true
    // },
    // product name
    name: {
        type: String,
        required: true,
    },
    // image
    imageURL: {
        type: String,
        required: true,
    },
    // category: pin, patch, sticker, merch, other
    category: {
        type: String,
        required: true,
    },
    // character name
    character: {
        type: String,
    },
    // ip
    ip: {
        type: String,
    },
    // quantity
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    // description
    description: {
        type: String,
    },
    // for timestamp
    time: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Product', ProductSchema);