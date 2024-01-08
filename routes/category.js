const express = require('express');
const router = express.Router();
const Category = require('../schema/category');
const Product = require('../schema/product');

// add
router.post('/add', async (req, res) => {
    const { name, order } = req.body;
    try {
        const newCategory = new Category({
            name,
            order,
            isdelete: false
        });
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({ isdelete: false })
            .sort({ order: 1 })
            .exec();
        const showcate = await Promise.all(
            categories.map(async (category) => {
                const products = await Product.find({ category: category._id, isdelete: false });
                return {
                    category,
                    products
                };
            })
        );
        res.status(200).json(showcate);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Xóa
router.put('/delete/:categoryId', async (req, res) => {
    const categoryId = req.params.categoryId;

    try {
        const deletedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { isdelete: true },
            { new: true }
        );

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(deletedCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Sửa
router.put('/edit/:categoryId', async (req, res) => {
    const categoryId = req.params.categoryId;
    const { name, order } = req.body;

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name, order },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
