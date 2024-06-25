const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/authenticate', userController.authenticate);
router.get('/userdetail',userController.getUserDetails);
router.get('/email',userController.getEmail);
router.put('/userprofile', userController.updateUserProfile);
router.put('/updatepassword', userController.updateUserPassword);

module.exports = router;
