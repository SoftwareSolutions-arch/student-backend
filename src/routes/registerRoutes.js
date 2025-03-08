const express = require('express');
const router = express.Router();
const userController = require('../controllers/registerController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/get-users', authMiddleware, userController.getUsers);


router.post('/register', userController.createUser);

module.exports = router;