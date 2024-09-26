const Product = require('../models/Product'); 
const mongoose = require('mongoose');
const ethers = require('ethers');
const utils = ethers;




console.log('Ethers utils:', utils);  // Check if utils is defined

const { createProduct: createProductBlockchain, updateProductState: updateProductStateBlockchain, transferOwnership: transferOwnershipBlockchain } = require('../blockchain');




const createProduct = async (req, res) => {
    try {
        console.log('Create product route hit');
        const { name, description, owner } = req.body;

        
        if (!name || !description || !owner) {
            return res.status(400).json({ message: 'All fields (name, description, owner) are required' });
        }

       
        const newProduct = new Product({ name, description, owner });
        await newProduct.save();
        await createProductBlockchain(newProduct._id.toString(), name);

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error in createProduct:', error);
        res.status(500).json({ message: 'Error creating product', error });
    }
};


const stateMapping = {
    'Created': 0,
    'Manufactured': 1,
    'ForSale': 2,
    'Sold': 3,
    'Shipped': 4,
    'Received': 5,
    'Verified': 6
};

const updateProductState = async (req, res) => {
    try {
        const { productId } = req.params;  
        const { newState } = req.body;     

        console.log("Received Product ID:", productId);  
        console.log("Received New State:", newState);    

        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        
        const newStateEnumValue = stateMapping[newState];
        if (newStateEnumValue === undefined) {
            return res.status(400).json({ message: 'Invalid state value' });
        }

        
        product.state = newState;
        await product.save();

        
        if (!productId) {
            throw new Error("Invalid productId. It cannot be null or undefined.");
        }

        // Hash the MongoDB ObjectId (productId) using ethers.utils.id()
        const hashedProductId = ethers.keccak256(ethers.toUtf8Bytes(productId.toString()));  // Convert to string

        console.log("Hashed Product ID for Blockchain:", hashedProductId);

        // Call blockchain to update the product state using the hashed product ID
        await updateProductStateBlockchain(hashedProductId, newStateEnumValue);

        res.json({ message: 'Product state updated successfully', product });
    } catch (error) {
        console.error('Error updating product state:', error);
        res.status(500).json({ message: 'Error updating state', error: error.message });
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
