import express from 'express';
import ProductManager from './productManager.js'; 
import CartManager from './cartManager.js';

const app = express();
app.use(express.json());


const productManager = new ProductManager("./products.json");
const cartManager = new CartManager("./carts.json");

// Rutas para Productos
app.get('/', (req, res) => {
    res.json({ message: '¡Hola, mundo!' });
});

app.get("/api/products", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.status(200).json({ message: 'Lista de productos actualizada', products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/api/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const products = await productManager.getProducts();
        const product = products.find(p => p.id === pid);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto encontrado', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/api/products", async (req, res) => {
    try {
        const newProduct = req.body;
        const products = await productManager.addProduct(newProduct);
        res.status(201).json({ message: 'Producto agregado', products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put("/api/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const updates = req.body;
        const products = await productManager.setProductById(pid, updates);
        res.status(200).json({ message: 'Producto actualizado', products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete("/api/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const products = await productManager.deleteProductById(pid);
        res.status(200).json({ message: 'Producto eliminado', products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rutas para Carritos
app.post("/api/carts", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ message: 'Carrito creado', cart: newCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/api/carts/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartManager.getCartById(cid);
        res.status(200).json({ message: 'Carrito encontrado', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const updatedCart = await cartManager.addProductToCart(cid, pid);
        res.status(200).json({ message: 'Producto agregado al carrito', cart: updatedCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(8080, () => {
    console.log('Server iniciado en el puerto http://localhost:8080');
});