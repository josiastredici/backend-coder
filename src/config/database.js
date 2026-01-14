import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://jtcusermongo:MongoDest7!@cluster0.hecpchd.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0');
        console.log('✅ Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error);
        console.error('Detalles:', error.message);
        process.exit(1);
    }
};