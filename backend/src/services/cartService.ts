import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { NotFoundError, AppError } from '../utils/errors.js';
import { ICart } from '../types/index.js';
import { HTTP_STATUS } from '../config/constants.js';
import { Types } from 'mongoose';

export interface AddToCartInput {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export class CartService {
  async getCart(userId: string): Promise<ICart | null> {
    const cart = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      select: 'title price image',
    });

    return cart ? cart.toObject() : null;
  }

  async addToCart(
    userId: string,
    input: AddToCartInput
  ): Promise<ICart> {
    const { productId, quantity, size, color } = input;
    
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError('Product');
    }

    // Check inventory
    const inventoryKey = size && color ? `${size}-${color}` : productId;
    const availableQuantity = product.inventory?.[inventoryKey] || 0;
    if (availableQuantity < quantity) {
      throw new AppError('Insufficient stock', HTTP_STATUS.CONFLICT);
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId: new Types.ObjectId(productId),
        quantity,
        size,
        color,
        addedAt: new Date(),
      });
    }

    // Recalculate totals
    await this.recalculateCart(cart);
    await cart.save();

    return cart.toObject();
  }

  async removeFromCart(userId: string, itemId: string): Promise<ICart> {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new NotFoundError('Cart');
    }

    // Find and remove item
    const itemIndex = cart.items.findIndex(
      (item) => (item as any)._id?.toString() === itemId
    );

    if (itemIndex === -1) {
      throw new NotFoundError('Cart item');
    }

    cart.items.splice(itemIndex, 1);

    // Recalculate totals
    await this.recalculateCart(cart);
    await cart.save();

    return cart.toObject();
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    quantity: number
  ): Promise<ICart> {
    if (quantity < 1) {
      throw new AppError('Quantity must be at least 1', HTTP_STATUS.BAD_REQUEST);
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new NotFoundError('Cart');
    }

    const item = cart.items.find((i) => (i as any)._id?.toString() === itemId);
    if (!item) {
      throw new NotFoundError('Cart item');
    }

    // Check inventory
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new NotFoundError('Product');
    }

    const inventoryKey =
      item.size && item.color ? `${item.size}-${item.color}` : item.productId.toString();
    const availableQuantity = product.inventory?.[inventoryKey] || 0;

    if (availableQuantity < quantity) {
      throw new AppError('Insufficient stock', HTTP_STATUS.CONFLICT);
    }

    item.quantity = quantity;

    // Recalculate totals
    await this.recalculateCart(cart);
    await cart.save();

    return cart.toObject();
  }

  async clearCart(userId: string): Promise<void> {
    await Cart.findOneAndDelete({ userId });
  }

  private async recalculateCart(cart: ICart): Promise<void> {
    let totalPrice = 0;
    let totalItems = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        totalPrice += product.price * item.quantity;
        totalItems += item.quantity;
      }
    }

    cart.totalPrice = totalPrice;
    cart.totalItems = totalItems;
  }
}

export const cartService = new CartService();
