const Category = require('../models/Category');

class CategoryService {
  async createCategory(categoryData) {
    const category = new Category(categoryData);
    return await category.save();
  }

  async getAllCategories() {
    return await Category.find();
  }

  async getCategoryById(id) {
    return await Category.findById(id);
  }

  async updateCategory(id, updateData) {
    return await Category.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteCategory(id) {
    return await Category.findByIdAndDelete(id);
  }
}

module.exports = new CategoryService();