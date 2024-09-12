const Product = require('../models/Product'); 
const mongoose = require('mongoose');




const createProduct = async (req, res) => {
    try {
        console.log('Create product route hit');
        const { name, description, owner } = req.body;

        
        if (!name || !description || !owner) {
            return res.status(400).json({ message: 'All fields (name, description, owner) are required' });
        }

       
        const newProduct = new Product({ name, description, owner });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error in createProduct:', error);
        res.status(500).json({ message: 'Error creating product', error });
    }
};


const updateProductState = async (req, res) => {
    try {
        const { productId } = req.params;
        const { state } = req.body;
        const product = await Product.findById(productId);
        product.state = state;
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error updating state', error });
    }
};


const transferProductOwnership = async (req, res) => {
    try {
        const { productId } = req.params;
        const { newOwner } = req.body;
        const product = await Product.findById(productId);
        product.owner = newOwner;
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error transferring ownership', error });
    }
};


const getProduct = async (req, res) => {
    try {
        let { productId } = req.params;

        
        productId = productId.trim();

        
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        
        const product = await Product.findById(productId);

        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        
        res.json(product);
    } catch (error) {
        console.error('Error in getProduct:', error);
        res.status(500).json({ message: 'Error retrieving product', error });
    }
};

module.exports = { createProduct, updateProductState, transferProductOwnership, getProduct };
