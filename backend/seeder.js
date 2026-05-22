const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const products = require('./data/products');

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    await Product.deleteMany({});
    console.log('Old products deleted...');

    const User = require('./models/User');
    const adminUser = await User.findOne({ role: 'admin' });
    
    // If no admin user exists, just get any user or create one
    let vendorId = null;
    if (adminUser) {
      vendorId = adminUser._id;
    } else {
      const anyUser = await User.findOne({});
      if (anyUser) {
        vendorId = anyUser._id;
      } else {
         // Create a dummy user if none exists
         const dummyUser = await User.create({ name: 'Admin', email: 'admin@test.com', password: 'password', role: 'admin' });
         vendorId = dummyUser._id;
      }
    }

    const seededProducts = products.map((p) => ({ ...p, vendor: vendorId }));
    await Product.insertMany(seededProducts);
    console.log('Products seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();