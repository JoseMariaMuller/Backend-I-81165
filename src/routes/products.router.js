import { Router } from 'express';
import {
    getAllProducts,
    setProductById  
} from '../controllers/products.controller.js';

const productsRouter = Router();


productsRouter.get('/', getAllProducts);        
productsRouter.put('/:pid', setProductById);   

export default productsRouter;