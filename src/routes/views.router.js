import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import CartManager from "../managers/CartManager.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();


router.get("/", async (req, res) => {
    try {
        const result = await productManager.getProducts({});
        res.render("home", { 
            title: "Lista de Productos",
            products: result.docs
        });
    } catch (error) {
        res.status(500).send("Error al cargar los productos");
    }
});


router.get("/realtimeproducts", async (req, res) => {
    try {
        const result = await productManager.getProducts({});
        res.render("realTimeProducts", { 
            title: "Productos en Tiempo Real",
            products: result.docs
        });
    } catch (error) {
        res.status(500).send("Error al cargar los productos");
    }
});


router.get("/products", async (req, res) => {
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

        const options = { limit, page, sort, query: queryFilter };
        const result = await productManager.getProducts(options);

        res.render("products", {
            title: "Productos",
            products: result.docs,
            pagination: {
                page: result.page,
                totalPages: result.totalPages,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
                nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null
            }
        });
    } catch (error) {
        res.status(500).send("Error al cargar los productos");
    }
});


router.get("/products/:pid", async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }
        res.render("productDetail", {
            title: product.title,
            product
        });
    } catch (error) {
        res.status(500).send("Error al cargar el producto");
    }
});


router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }
        res.render("cart", {
            title: "Mi Carrito",
            cart,
            cartId: req.params.cid
        });
    } catch (error) {
        res.status(500).send("Error al cargar el carrito");
    }
});

export default router;