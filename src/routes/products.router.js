const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/ProductManager");
const productManager = new ProductManager("./src/models/products.json");

// getProducts
router.get("/products", async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();

        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }

    } catch (error) {

        console.error("Error when obtaining the products.", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// getProductById
router.get("/products/:pid", async (req, res) => {

    const id = req.params.pid;

    try {

        const product = await productManager.getProductById(parseInt(id));

        if (!product) {
            return res.json({ error: "Product not found." });
        }

        res.json(product);

    } catch (error) {
        console.error("Error when obtaining the product.", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// addProduct
router.post("/products", async (req, res) => {
    const newProduct = req.body; 

    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({ message: "Product successfully added." });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// updateProduct
router.put("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    const updatedProduct = req.body; 

    try {
        await productManager.updateProduct(parseInt(id), updatedProduct);
        res.json({ message: "Product successfully updated." });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// deleteProduct
router.delete("/products/:pid", async (req, res) => {
    const id = req.params.pid; 

    try {
        await productManager.deleteProduct(parseInt(id));
        res.json({ message: "Product successfully removed." });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
});

module.exports = router;