require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    
    const db = mongoose.connection.db;
    
    // Update the PlayStation 5 product with a working image
    const res = await db.collection('products').updateOne(
      { name: 'PlayStation 5 Console' },
      { 
        $set: { 
          name: 'Sony PlayStation 5',
          description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.',
          price: 49990,
          category: 'electronics',
          image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80' // PS5 DualSense image
        } 
      }
    );
    
    console.log(`Updated ${res.modifiedCount} product.`);
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();
