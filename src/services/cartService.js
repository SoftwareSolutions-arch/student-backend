const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartService {
  async getCart(userId) {
    return Cart.findOne({ user: userId }).populate('items.product');
  }

  async addToCart(userId, productId, quantity) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.equals(productId));
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.productPrice
      });
    }

    return cart.save();
  }

  async updateCartItem(userId, itemId, quantity) {
    const cart = await Cart.findOne({ user: userId });
    const item = cart.items.id(itemId);
    
    if (!item) throw new Error('Item not found in cart');
    item.quantity = quantity;
    
    return cart.save();
  }

  async removeCartItem(userId, itemId) {
    const cart = await Cart.findOne({ user: userId });
    cart.items.pull(itemId);
    return cart.save();
  }

  async clearCart(userId) {
    return Cart.findOneAndDelete({ user: userId });
  }
}

module.exports = new CartService();