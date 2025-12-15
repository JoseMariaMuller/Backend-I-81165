import { Router } from 'express';
import ProductManager from '../productManager.js';

const productsRouter = Router();
const productManager = new ProductManager("./data/products.json");

// GET /api/products Listar todos los productos
productsRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.status(200).json({ message: 'Lista de productos actualizada', products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/products/:pid Obtener un producto por ID
productsRouter.get('/:pid', async (req, res) => {
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

// PUT /api/products/:pid Actualizar un producto
productsRouter.put('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const updates = req.body;
        const products = await productManager.setProductById(pid, updates);
        res.status(200).json({ message: 'Producto actualizado', products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default productsRouter;