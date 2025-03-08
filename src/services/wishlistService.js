const Wishlist = require('../models/Wishlist');

class WishlistService {
  async getWishlist(userId) {
    return Wishlist.findOne({ user: userId }).populate('products');
  }

  async addToWishlist(userId, productId) {
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }

    return wishlist.save();
  }

  async removeFromWishlist(userId, productId) {
    const wishlist = await Wishlist.findOne({ user: userId });
    wishlist.products.pull(productId);
    return wishlist.save();
  }

  async clearWishlist(userId) {
    return Wishlist.findOneAndDelete({ user: userId });
  }
}

module.exports = new WishlistService();