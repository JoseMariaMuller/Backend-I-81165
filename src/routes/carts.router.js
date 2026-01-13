import { Router } from 'express';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import { throwHttpError } from '../utils/httpError.js';

const cartsRouter = Router();

// POST /api/carts 
cartsRouter.post('/', async (req, res, next) => {
    try {
        const cart = await Cart.create({});
        res.status(201).json({ status: 'success', payload: cart });
    } catch (error) {
        next(error);
    }
});

// GET /api/carts/:cid 
cartsRouter.get('/:cid', async (req, res, next) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) throwHttpError('Carrito no encontrado', 404);
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        next(error);
    }
});

// POST /api/carts/:cid/product/:pid 
cartsRouter.post('/:cid/product/:pid', async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body;

        // Verificar que el producto exista
        const product = await Product.findById(pid);
        if (!product) throwHttpError('Producto no encontrado', 404);

        // Verificar que el carrito exista
        const cart = await Cart.findById(cid);
        if (!cart) throwHttpError('Carrito no encontrado', 404);

        // Verificar si el producto ya está en el carrito
        const productInCart = cart.products.find(p => p.product.toString() === pid);
        if (productInCart) {
            productInCart.quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        await cart.save();
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/carts/:cid/products/:pid 
cartsRouter.delete('/:cid/products/:pid', async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findByIdAndUpdate(
            cid,
            { $pull: { products: { product: pid } } },
            { new: true }
        );
        if (!cart) throwHttpError('Carrito no encontrado', 404);
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/carts/:cid 
cartsRouter.delete('/:cid', async (req, res, next) => {
    try {
        const cart = await Cart.findByIdAndUpdate(
            req.params.cid,
            { products: [] },
            { new: true }
        );
        if (!cart) throwHttpError('Carrito no encontrado', 404);
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        next(error);
    }
});

export default cartsRouter;