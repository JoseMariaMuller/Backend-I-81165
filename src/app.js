import express from 'express';
import { engine } from 'express-handlebars';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Manejadores
import ProductManager from './productManager.js';

// Rutas
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js'; 

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const productManager = new ProductManager("./data/products.json");

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Rutas
app.use('/', viewsRouter);


io.on('connection', (socket) => {
    productManager.getProducts()
        .then(products => socket.emit('productsUpdated', products))
        .catch(err => console.error('Error al enviar productos:', err.message));
});


app.post('/api/products', async (req, res) => {
    try {
        const newProduct = req.body;
        const products = await productManager.addProduct(newProduct);
        res.status(201).json({ message: 'Producto agregado', products });
        io.emit('productsUpdated', products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/products/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const products = await productManager.deleteProductById(pid);
        res.status(200).json({ message: 'Producto eliminado', products });
        io.emit('productsUpdated', products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter); 

// Puerto
const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});