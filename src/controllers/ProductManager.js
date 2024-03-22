const fs = require("fs").promises;

class ProductManager {
    static lastId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            const productsArr = await this.readJsonFile();

            if (!title || !description || !price || !code || !stock || !category) {
                console.log("All fields are required.");
                return;
            }
            if (productsArr.some(item => item.code === code)) {
                console.log("The code must be unique for each product.");
                return;
            }

            const newProduct = {
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            };
            if (productsArr.length > 0) {
                ProductManager.lastId = productsArr.reduce((maxId, product) => Math.max(maxId, product.id), 0);
            }

            newProduct.id = ++ProductManager.lastId; 
            productsArr.push(newProduct);
            await this.saveFile(productsArr);

        } catch (error) {
            console.log("Error when adding product.", error);
            throw error; 
        }
    };
    async getProducts() {
        try {
            const productsArr = await this.readJsonFile();
            return productsArr;

        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        }
    };

    async getProductById(id) {
        try {
            const productsArr = await this.readJsonFile();
            const findItem = productsArr.find(item => item.id === id);

            if (!findItem) {
                console.log("Product not found.");
                return null;
            } else {
                console.log("Product found.");
                return findItem;
            }

        } catch (error) {
            console.log("Error reading file.", error);
            throw error;
        }
    };

    //leer el archivo
    async readJsonFile() {
        try {
            const response = await fs.readFile(this.path, "utf-8");
            const productsArr = JSON.parse(response);
            return productsArr;

        } catch (error) {
            console.log("Error reading file.", error);
            throw error;
        }
    };

    //guardar el archivo
    async saveFile(productsArr) {
        try {
            await fs.writeFile(this.path, JSON.stringify(productsArr, null, 2));
        } catch (error) {
            console.log("Error saving file.", error);
            throw error;
        }
    };

    async updateProduct(id, productoActualizado) {
        try {
            const productsArr = await this.readJsonFile();
            const index = productsArr.findIndex(item => item.id === id);

            if (index !== -1) {
                productsArr[index] = { ...productsArr[index], ...productoActualizado };
                await this.saveFile(productsArr);
                console.log("Updated product.");
            } else {
                console.log("Product not found.");
            }

        } catch (error) {
            console.log("Error updating product.", error);
            throw error;
        }
    };

    async deleteProduct(id) {
        try {
            const productsArr = await this.readJsonFile();
            const index = productsArr.findIndex(item => item.id === id);

            if (index !== -1) {
                productsArr.splice(index, 1);
                await this.saveFile(productsArr);
                console.log("Removed product.");
            } else {
                console.log("Product could not be found.");
            }

        } catch (error) {
            console.log("Error deleting product.", error);
            throw error;
        }
    };
};

module.exports = ProductManager;