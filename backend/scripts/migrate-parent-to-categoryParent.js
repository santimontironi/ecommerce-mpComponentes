import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function migrateParentToCategoryParent() {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✓ Conectado a MongoDB\n');

        const db = mongoose.connection.db;
        const categoriesCollection = db.collection('categories');

        // Obtener todas las categorías
        const categories = await categoriesCollection.find({}).toArray();
        
        console.log(`\nEncontradas ${categories.length} categorías para migrar`);

        let updated = 0;
        let skipped = 0;

        for (const category of categories) {
            // Si tiene el campo 'parent' pero no 'categoryParent'
            if (category.hasOwnProperty('parent') && !category.hasOwnProperty('categoryParent')) {
                await categoriesCollection.updateOne(
                    { _id: category._id },
                    { 
                        $set: { categoryParent: category.parent },
                        $unset: { parent: "" } // Eliminar el campo 'parent'
                    }
                );
                updated++;
                console.log(`✓ Categoría "${category.name}" migrada`);
            } else {
                skipped++;
            }
        }

        console.log(`\n✅ Migración completada:`);
        console.log(`   - ${updated} categorías actualizadas`);
        console.log(`   - ${skipped} categorías omitidas (ya estaban migradas)`);
        
    } catch (error) {
        console.error('❌ Error en la migración:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n✓ Conexión cerrada');
    }
}

migrateParentToCategoryParent();
