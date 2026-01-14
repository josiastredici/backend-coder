import Product from '../models/Product.js';

export default class ProductManager {
    async getProducts(options = {}) {
        try {
            const { limit = 10, page = 1, sort, query } = options;
            
            
            const filter = {};
            if (query) {
                
                if (query.category) {
                    filter.category = query.category;
                }
                if (query.status !== undefined) {
                    filter.status = query.status === 'true' || query.status === true;
                }
            }

            
            const paginateOptions = {
                limit: parseInt(limit),
                page: parseInt(page),
                lean: true
            };

            
            if (sort) {
                paginateOptions.sort = { price: sort === 'asc' ? 1 : -1 };
            }

            const result = await Product.paginate(filter, paginateOptions);
            return result;
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            return await Product.findById(id);
        } catch (error) {
            throw new Error(`Error al obtener producto: ${error.message}`);
        }
    }

    async addProduct(productData) {
        try {
            const product = new Product(productData);
            await product.save();
            return product;
        } catch (error) {
            throw new Error(`Error al crear producto: ${error.message}`);
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const product = await Product.findByIdAndUpdate(
                id,
                updatedFields,
                { new: true }
            );
            return product;
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            await Product.findByIdAndDelete(id);
            return true;
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }
}