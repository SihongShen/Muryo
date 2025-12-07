// initiate express
const express = require('express');
// create router
const router = express.Router();
// import product model
const Product = require('../models/product');

// route to get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ time: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// route to add a new product
router.post('/', async (req, res) => {
    const { name, imageURL, category, character, ip, quantity, description } = req.body;
    const newProduct = new Product({
        name,
        imageURL,
        category,
        character,
        ip,
        quantity,
        description
    });

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

// route to delete a product by id
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// route to edit
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// export router
module.exports = router;