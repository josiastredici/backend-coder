import Cart from '../models/Cart.js';

export default class CartManager {
    async getCarts() {
        try {
            return await Cart.find().populate('products.product');
        } catch (error) {
            throw new Error(`Error al obtener carritos: ${error.message}`);
        }
    }

    async createCart() {
        try {
            const cart = new Cart({ products: [] });
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al crear carrito: ${error.message}`);
        }
    }

    async getCartById(id) {
        try {
            return await Cart.findById(id).populate('products.product');
        } catch (error) {
            throw new Error(`Error al obtener carrito: ${error.message}`);
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(
                p => p.product.toString() === pid
            );

            if (productIndex >= 0) {
                cart.products[productIndex].quantity++;
            } else {
                cart.products.push({ product: pid, quantity: 1 });
            }

            await cart.save();
            return await Cart.findById(cid).populate('products.product');
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
        }
    }

    async removeProductFromCart(cid, pid) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) return null;

            cart.products = cart.products.filter(
                p => p.product.toString() !== pid
            );

            await cart.save();
            return await Cart.findById(cid).populate('products.product');
        } catch (error) {
            throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
        }
    }

    async updateCart(cid, products) {
        try {
            const cart = await Cart.findByIdAndUpdate(
                cid,
                { products },
                { new: true }
            ).populate('products.product');
            return cart;
        } catch (error) {
            throw new Error(`Error al actualizar carrito: ${error.message}`);
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(
                p => p.product.toString() === pid
            );

            if (productIndex >= 0) {
                cart.products[productIndex].quantity = quantity;
                await cart.save();
                return await Cart.findById(cid).populate('products.product');
            }

            return null;
        } catch (error) {
            throw new Error(`Error al actualizar cantidad: ${error.message}`);
        }
    }

    async clearCart(cid) {
        try {
            const cart = await Cart.findByIdAndUpdate(
                cid,
                { products: [] },
                { new: true }
            );
            return cart;
        } catch (error) {
            throw new Error(`Error al vaciar carrito: ${error.message}`);
        }
    }
}