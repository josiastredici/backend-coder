import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

// Vista home - Lista estática de productos
router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("home", { 
            title: "Lista de Productos",
            products 
        });
    } catch (error) {
        res.status(500).send("Error al cargar los productos");
    }
});

// Vista realTimeProducts - Lista dinámica con WebSockets
router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("realTimeProducts", { 
            title: "Productos en Tiempo Real",
            products 
        });
    } catch (error) {
        res.status(500).send("Error al cargar los productos");
    }
});

export default router;