import { Router } from 'express';
import Product from '../models/product.model.js';
import Cart from '../models/cart.model.js';

const viewsRouter = Router();


viewsRouter.get('/', async (req, res, next) => {
    try {
        const { limit = 10, page = 1 } = req.query;

        const productsData = await Product.paginate({}, { limit: parseInt(limit), page: parseInt(page), lean: true });
        const products = productsData.docs;

        // Generar enlaces de paginación
        const links = [];
        for (let i = 1; i <= productsData.totalPages; i++) {
            links.push({
                text: i,
                link: `?limit=${limit}&page=${i}`,
                active: i === productsData.page
            });
        }

        res.render('home', {
            title: 'Home',
            products,
            links,
            currentPage: productsData.page,
            totalPages: productsData.totalPages
        });
    } catch (error) {
        next(error);
    }
});

// GET /products/:pid 
viewsRouter.get('/products/:pid', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.pid).lean();
        if (!product) return res.status(404).render('404', { title: 'Producto no encontrado' });

        const carts = await Cart.find({}, 'id').lean();

        res.render('productDetail', {
            title: product.title,
            product,
            carts
        });
    } catch (error) {
        next(error);
    }
});

// GET /carts/:cid 
viewsRouter.get('/carts/:cid', async (req, res, next) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
        if (!cart) return res.status(404).render('404', { title: 'Carrito no encontrado' });

        res.render('cartDetail', {
            title: `Carrito ${req.params.cid}`,
            cart
        });
    } catch (error) {
        next(error);
    }
});


// GET /realtimeproducts 
viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { title: 'Real Time Products' });
});

export default viewsRouter;