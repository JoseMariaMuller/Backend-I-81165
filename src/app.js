import express from 'express';
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';
import { createServer } from 'http';
import { Server } from 'socket.io';

import dotenv from 'dotenv';
import __dirname from '../dirname.js';

import connectMongoDB from './config/db.js';

// Rutas
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

// Cargar variables de entorno
dotenv.config({ path: __dirname + "/.env" });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.set('socketio', io);

// Conectar a MongoDB
connectMongoDB();

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars con helper
Handlebars.registerHelper('multiply', function (a, b) {
  return (a * b).toFixed(2);
});

app.engine('handlebars', engine({ handlebars: Handlebars }));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/src/views');

// Rutas de vistas
app.use('/', viewsRouter);

// WebSockets
io.on('connection', async (socket) => {
  try {
    const { default: Product } = await import('./models/product.model.js');
    const products = await Product.find().lean();
    socket.emit('productsUpdated', products);
  } catch (error) {
    console.error('Error al enviar productos:', error.message);
  }
});

// RUTA POST 
app.post('/api/products', async (req, res) => {
  try {
    const { default: Product } = await import('./models/product.model.js');
    const newProduct = await Product.create(req.body);

    
    const products = await Product.find().lean();
    io.emit('productsUpdated', products);

    
    return res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// RUTA DELETE 
app.delete('/api/products/:pid', async (req, res) => {
  try {
    const { default: Product } = await import('./models/product.model.js');
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
    
    if (!deletedProduct) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    
    const products = await Product.find().lean();
    io.emit('productsUpdated', products);

    return res.status(200).json({ status: 'success', payload: deletedProduct });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});