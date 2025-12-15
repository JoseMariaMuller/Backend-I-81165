import fs from "fs/promises";
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CartManager {

    constructor(pathFile) {
        
        this.pathFile = path.join(__dirname, pathFile);
        this.init();
    }

    async init() {
        try {
            await fs.access(this.pathFile);
        } catch (error) {
            await fs.writeFile(this.pathFile, JSON.stringify([], null, 2));
        }
    }

    async generateNewId() {
        const carts = await this.getCarts();
        let newId = 1;
        if (carts.length > 0) {
            newId = Math.max(...carts.map(c => parseInt(c.id))) + 1;
        }
        return newId.toString();
    }

    async getCarts() {
        try {
            const fileData = await fs.readFile(this.pathFile, "utf-8");
            const carts = JSON.parse(fileData);
            return carts;
        } catch (error) {
            throw new Error("Error al traer los carritos: " + error.message);
        }
    }

    async getCartById(cid) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(c => c.id === cid);
            if (!cart) {
                throw new Error(`Carrito con ID ${cid} no encontrado`);
            }
            return cart;
        } catch (error) {
            throw new Error("Error al traer el carrito por ID: " + error.message);
        }
    }

    async createCart() {
        try {
            const fileData = await fs.readFile(this.pathFile, "utf-8");
            const carts = JSON.parse(fileData);

            const newId = await this.generateNewId();
            const newCart = { id: newId, products: [] };
            carts.push(newCart);

            await fs.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");
            return newCart;
        } catch (error) {
            throw new Error("Error al crear el carrito: " + error.message);
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const carts = await this.getCarts();

            const cartIndex = carts.findIndex(c => c.id === cid);
            if (cartIndex === -1) {
                throw new Error(`Carrito con ID ${cid} no encontrado`);
            }

            const productInCartIndex = carts[cartIndex].products.findIndex(p => p.product === pid);

            if (productInCartIndex >= 0) {
                carts[cartIndex].products[productInCartIndex].quantity++;
            } else {
                carts[cartIndex].products.push({ product: pid, quantity: 1 });
            }

            await fs.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");
            return carts[cartIndex];
        } catch (error) {
            throw new Error("Error al agregar producto al carrito: " + error.message);
        }
    }
}

export default CartManager;