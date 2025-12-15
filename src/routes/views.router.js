import { Router } from 'express';
import ProductManager from '../productManager.js';

const viewsRouter = Router();
const productManager = new ProductManager("./data/products.json");

viewsRouter.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { title: 'Home', products });
});

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { title: 'Real Time Products' });
});

export default viewsRouter;