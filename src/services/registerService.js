const User = require('../models/registerModel');
const bcrypt = require("bcryptjs");

exports.getAllUsers = async () => {
  return await User.find();
};

exports.createUser = async (userData) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    userData.password = hashedPassword;
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
};
