const express = require("express");
const router = express.Router(); 

const CartManager = require("../controllers/CartManager");
const cartManager = new CartManager("./src/models/carts.json");

// creamos el carrito
router.post("/carts", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).json({ error:"Internal Server Error." });
    }
});

// obtenemos los productos de un carrito especifico
router.get("/carts/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);

    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// aregamos un producto especifico a un carrito especifico 
router.post("/carts/:cid/products/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1; 

    try {
        const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

module.exports = router; 