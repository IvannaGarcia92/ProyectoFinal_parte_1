const fs = require("fs").promises;

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.lastId = 0;
        this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);

            if (this.carts.length > 0) {
                this.lastId = Math.max(...this.carts.map(cart => cart.id));
            }

        } catch (error) {
            console.log("Error al crear los carritos: ", error);
            await this.saveCarts();
        }
    };

    async saveCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    };

    async createCart() {
        const newCart = {
            id: ++this.lastId,
            products: []
        }
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    };

    async getCartById(cartId) {
        try {
            const cart = this.carts.find(c => c.id === cartId);

            if (!cart) {
                console.log("No hay carrito con ese id");
                return;
            }

            return cart;

        } catch (error) {
            console.log("Error al obtener un carrito por id: ", error);
        }
    };

    async addProductToCart(cartId, productoId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        const existingProduct = cart.products.find(p => p.product === productoId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productoId, quantity });
        }

        await this.saveCarts();
        return cart;
    };
};

module.exports = CartManager;