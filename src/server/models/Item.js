const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: String,
    description: String,
    artist: String, // for movies
    genre: String,
    type: { type: String, enum: ['CD', 'DVD', 'Cassette'] }, // item type
    stock: Number,
    image: String,
    price: Number
});

module.exports = mongoose.model('Item', itemSchema);
