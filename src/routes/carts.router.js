import { Router } from 'express';
import CartManager from '../cartManager.js';

const cartsRouter = Router();
const cartManager = new CartManager("./data/carts.json");

// POST /api/carts Crear un nuevo carrito
cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ message: 'Carrito creado', cart: newCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/carts/:cid Obtener un carrito por ID
cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartManager.getCartById(cid);
        res.status(200).json({ message: 'Carrito encontrado', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/carts/:cid/product/:pid Agregar producto al carrito
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const updatedCart = await cartManager.addProductToCart(cid, pid);
        res.status(200).json({ message: 'Producto agregado al carrito', cart: updatedCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default cartsRouter;