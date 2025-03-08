const SubCategory = require('../models/SubCategory');

class SubCategoryService {
  async createSubCategory(subCategoryData) {
    const subCategory = new SubCategory(subCategoryData);
    return await subCategory.save();
  }

  async getAllSubCategories() {
    return await SubCategory.find().populate('parentCategory');
  }

  async getSubCategoryById(id) {
    return await SubCategory.findById(id).populate('parentCategory');
  }

  async updateSubCategory(id, updateData) {
    return await SubCategory.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true
    });
  }

  async deleteSubCategory(id) {
    return await SubCategory.findByIdAndDelete(id);
  }

  async getSubCategoriesByCategory(categoryId) {
    return await SubCategory.find({ parentCategory: categoryId });
  }
}

module.exports = new SubCategoryService();