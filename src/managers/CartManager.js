import fs from "fs/promises";
const path = "./src/data/carts.json";

export default class CartManager {
    async getCarts() {
        try {
            const data = await fs.readFile(path, "utf-8");
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async createCart() {
        const carts = await this.getCarts();

        const newCart = {
            id: Date.now().toString(),
            products: []
        };

        carts.push(newCart);
        await fs.writeFile(path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(c => c.id === id);
    }

    async addProductToCart(cid, pid) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cid);

        if (!cart) return null;

        const product = cart.products.find(p => p.product === pid);

        if (product) {
            product.quantity++;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await fs.writeFile(path, JSON.stringify(carts, null, 2));
        return cart;
    }
}

