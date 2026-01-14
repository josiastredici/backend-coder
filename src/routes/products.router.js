import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        
        let queryFilter = {};
        if (query) {
            try {
                queryFilter = JSON.parse(query);
            } catch {
                
                queryFilter = { category: query };
            }
        }

        const options = {
            limit,
            page,
            sort,
            query: queryFilter
        };

        const result = await productManager.getProducts(options);

        
        const response = {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        product ? res.json(product) : res.status(404).json({ error: "Producto no encontrado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        
        
        const io = req.app.get('io');
        const result = await productManager.getProducts({});
        io.emit('updateProducts', result.docs);
        
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const updated = await productManager.updateProduct(req.params.pid, req.body);
        
        
        if (updated) {
            const io = req.app.get('io');
            const result = await productManager.getProducts({});
            io.emit('updateProducts', result.docs);
        }
        
        updated ? res.json(updated) : res.status(404).json({ error: "Producto no encontrado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        await productManager.deleteProduct(req.params.pid);
        
        
        const io = req.app.get('io');
        const result = await productManager.getProducts({});
        io.emit('updateProducts', result.docs);
        
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;