const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

router.post('/property_details', propertyController.addPropertyDetails);
router.put('/property_details/:id', propertyController.updatePropertyDetails);
router.get('/property_details', propertyController.getAllProperties);
router.delete('/property_details/:id', propertyController.deletePropertyDetails);

module.exports = router;
