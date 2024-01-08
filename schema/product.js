const mongoose = require('../database/db');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    price: Number,
    isdelete: Boolean,
    order: Number,
    category: { type: Schema.Types.ObjectId, ref: 'Category' }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
