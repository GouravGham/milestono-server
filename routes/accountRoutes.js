
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/accounts', accountController.getAllAccounts);
router.post('/accounts', accountController.createAccount);

module.exports = router;
