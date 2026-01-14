export const handlebarsHelpers = {
    multiply: (a, b) => {
        return a * b;
    },
    
    calculateTotal: (products) => {
        if (!products || products.length === 0) return 0;
        
        return products.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    },
    
    eq: (a, b) => {
        return a === b;
    },
    
    gt: (a, b) => {
        return a > b;
    }
};