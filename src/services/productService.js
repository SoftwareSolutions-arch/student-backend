const Product = require('../models/Product');

class ProductService {
  async createProduct(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async getAllProducts() {
    return await Product.find()
      .populate('category')
      .populate('subCategory');
  }

  async getProductById(id) {
    return await Product.findById(id)
      .populate('category')
      .populate('subCategory');
  }

  async updateProduct(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }

  async getProductsByCategory(categoryId) {
    return await Product.find({ category: categoryId })
      .populate('subCategory');
  }

  async getProductsBySubCategory(subCategoryId) {
    return await Product.find({ subCategory: subCategoryId })
      .populate('category');
  }
}

module.exports = new ProductService();