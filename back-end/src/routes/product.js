const express = require('express');
const router = express.Router();
const Product = require('../models/ProductModel');

// Get all products with optional filters
router.get('/products', async (req, res) => {
    try {
        const { category, sort, search } = req.query;
        
        // Build query
        let query = { isDeleted: false };
        if (category) {
            query.category = category;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        let sortObj = {};
        if (sort) {
            // eslint-disable-next-line default-case
            switch (sort) {
                case 'name-asc':
                    sortObj.name = 1;
                    break;
                case 'name-desc':
                    sortObj.name = -1;
                    break;
                case 'price-asc':
                    sortObj.price = 1;
                    break;
                case 'price-desc':
                    sortObj.price = -1;
                    break;
            }
        }

        const products = await Product.find(query).sort(sortObj);

        res.json({
            success: true,
            data: products || [] // Ensure we always return an array
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get product by slug
router.get('/products/:slug', async (req, res) => {
    try {
        const product = await Product.findOne({ 
            slug: req.params.slug,
            isDeleted: false 
        });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Get related products (same category, excluding current product)
        const relatedProducts = await Product.find({
            category: product.category,
            slug: { $ne: product.slug },
            isDeleted: false
        }).limit(4);

        res.json({
            success: true,
            data: {
                product,
                relatedProducts: relatedProducts || [] // Ensure we always return an array
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category', { isDeleted: false });
        
        res.json({
            success: true,
            data: categories || [] // Ensure we always return an array
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router; 