const express = require('express');
const router = express.Router();
const Product = require('../schema/product');
const Category = require('../schema/category');

// Xuất
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ isdelete: false })
            .sort({ order: 1 })
            .populate('category', 'name order')
            .exec();
        const modifiedProducts = products.map(product => ({
            ...product.toObject(),
            category: product.category.name
        }));
        res.status(200).json(modifiedProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Thêm
router.post('/add', async (req, res) => {
    const { name, price, order, category } = req.body; 
    try {
        const existingCategory = await Category.findOne({ name: category });

        if (!existingCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const newItem = new Product({
            name: name,
            price: price,
            isdelete: false,
            order: order,
            category: existingCategory._id
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Xóa
router.put('/delete/:productId', async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findByIdAndUpdate(
            productId,
            { isdelete: true },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Sửa
router.put('/edit/:productId', async (req, res) => {
    const productId = req.params.productId;
    const { name, price, order, category } = req.body;

    try {
        const newCategory = await Category.findOne({ name: category });
        if (!newCategory) {
            return res.status(404).json({ message: 'New category not found' });
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name,
                price,
                order,
                category: newCategory._id 
            },
            { new: true } 
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

