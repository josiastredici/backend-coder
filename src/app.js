import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Iniciar servidor
const httpServer = app.listen(8080, () => {
    console.log("Servidor escuchando en el puerto 8080");
});

// Configurar Socket.io
const io = new Server(httpServer);

// Hacer io accesible en las rutas
app.set('io', io);

// Eventos de Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});