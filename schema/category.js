const mongoose = require('../database/db');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: String,
    order: Number,
    isdelete: Boolean
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
