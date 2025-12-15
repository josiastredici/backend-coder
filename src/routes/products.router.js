import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

router.get("/:pid", async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    product ? res.json(product) : res.status(404).send("Producto no encontrado");
});

router.post("/", async (req, res) => {
    const newProduct = await productManager.addProduct(req.body);
    
    // Emitir evento de socket para actualizar la vista en tiempo real
    const io = req.app.get('io');
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);
    
    res.status(201).json(newProduct);
});

router.put("/:pid", async (req, res) => {
    const updated = await productManager.updateProduct(req.params.pid, req.body);
    
    // Emitir evento de socket para actualizar la vista en tiempo real
    if (updated) {
        const io = req.app.get('io');
        const products = await productManager.getProducts();
        io.emit('updateProducts', products);
    }
    
    updated ? res.json(updated) : res.status(404).send("Producto no encontrado");
});

router.delete("/:pid", async (req, res) => {
    await productManager.deleteProduct(req.params.pid);
    
    // Emitir evento de socket para actualizar la vista en tiempo real
    const io = req.app.get('io');
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);
    
    res.send("Producto eliminado");
});

export default router;