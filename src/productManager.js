import fs from "fs/promises";
import crypto from "crypto";
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager {

    constructor(pathFile) {
        
        this.pathFile = path.join(__dirname, pathFile);
    }

    generateNewId() {
        return crypto.randomUUID();
    }

    async addProduct(newProduct) {
        try {
            const fileData = await fs.readFile(this.pathFile, "utf-8");
            const products = JSON.parse(fileData);

            const newId = this.generateNewId();
            const product = { id: newId, ...newProduct };
            products.push(product);

            await fs.writeFile(this.pathFile, JSON.stringify(products, null, 2), "utf-8");
            return products;
        } catch (error) {
            throw new Error("Error al añadir el nuevo producto: " + error.message);
        }
    }

    async getProducts() {
        try {
            const fileData = await fs.readFile(this.pathFile, "utf-8");
            const products = JSON.parse(fileData);
            return products;
        } catch (error) {
            throw new Error("Error al traer los productos: " + error.message);
        }
    }

    async setProductById(pid, updates) {
        try {
            const products = await this.getProducts();

            const indexProduct = products.findIndex((product) => product.id === pid);
            if (indexProduct === -1) throw new Error("Producto no encontrado");

            products[indexProduct] = { ...products[indexProduct], ...updates };

            await fs.writeFile(this.pathFile, JSON.stringify(products, null, 2), "utf-8");
            return products;
        } catch (error) {
            throw new Error("Error al actualizar un producto: " + error.message);
        }
    }

    async deleteProductById(pid) {
        try {
            const products = await this.getProducts();

            const filteredProducts = products.filter((product) => product.id !== pid);

            await fs.writeFile(this.pathFile, JSON.stringify(filteredProducts, null, 2), "utf-8");
            return filteredProducts;
        } catch (error) {
            throw new Error("Error al borrar un producto: " + error.message);
        }
    }
}

export default ProductManager;