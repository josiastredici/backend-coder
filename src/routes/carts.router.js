import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        cart ? res.json(cart) : res.status(404).json({ error: "Carrito no encontrado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
        updatedCart
            ? res.json(updatedCart)
            : res.status(404).json({ error: "Carrito no encontrado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const updatedCart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
        updatedCart
            ? res.json(updatedCart)
            : res.status(404).json({ error: "Carrito o producto no encontrado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:cid", async (req, res) => {
    try {
        const { products } = req.body;
        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ error: "Se requiere un arreglo de productos" });
        }
        
        const updatedCart = await cartManager.updateCart(req.params.cid, products);
        updatedCart
            ? res.json(updatedCart)
            : res.status(404).json({ error: "Carrito no encontrado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: "Se requiere una cantidad válida" });
        }
        
        const updatedCart = await cartManager.updateProductQuantity(
            req.params.cid, 
            req.params.pid, 
            quantity
        );
        
        updatedCart
            ? res.json(updatedCart)
            : res.status(404).json({ error: "Carrito o producto no encontrado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const updatedCart = await cartManager.clearCart(req.params.cid);
        updatedCart
            ? res.json(updatedCart)
            : res.status(404).json({ error: "Carrito no encontrado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;