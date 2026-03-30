import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  color: { type: String },
  category: { type: String, enum: ['men', 'women', 'accessories'] },
  sizes: [{ type: String }],
  images: [{ type: String }],
  badge: { type: String },
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
