const jwt = require('jsonwebtoken');
const Property = require('../models/property');

const addPropertyDetails = async (req, res) => {
    try {
      const token = req.headers.authorization;
  
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
  
        const formData = req.body.formData;
  
        const newProperty = new Property({
          sellType: formData.sellType,
          propertyCategory: formData.propertyCategory,
          oldProperty: formData.oldProperty,
          propertyContains: formData.propertyContains,
          amenities: formData.amenities,
          furnitures: formData.furnitures,
          email: decoded.email,
          city: formData.city,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          balconies: formData.balconies,
          ownership: formData.ownership,
          expectedPrice: formData.expectedPrice,
          pricePerSqFt: formData.pricePerSqFt,
          isAllInclusive: formData.isAllInclusive,
          isPriceNegotiable: formData.isPriceNegotiable,
          isTaxchargeExc: formData.isTaxchargeExc,
          uniqueFeatures: formData.uniqueFeatures,
          areaSqft: formData.areaSqft
        });
  
        try {
          const savedProperty = await newProperty.save();
          res.status(201).json({ message: 'Property details added successfully!', key: savedProperty._id });
        } catch (saveError) {
          console.error('Error saving property details:', saveError);
          res.status(500).json({ message: 'Failed to add property details.' });
        }
      });
    } catch (error) {
      console.error('Error adding property details:', error);
      res.status(500).json({ message: 'Failed to add property details.' });
    }
  };
  

const updatePropertyDetails = async (req, res) => {
    try {
        const uploadedPhotos = req.body.images;
        const propertyId = req.params.id;

        if (!uploadedPhotos || !propertyId) {
            return res.status(400).json({ message: 'Missing required parameters.' });
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            propertyId, 
            { uploadedPhotos: uploadedPhotos }, 
            { new: true }
        );

        if (!updatedProperty) {
            return res.status(404).json({ message: 'Property not found.' });
        }

        res.status(200).json({ message: 'Property details updated successfully.', property: updatedProperty });
    } catch (error) {
        console.error('Error updating property details:', error);
        res.status(500).json({ message: 'Failed to update property details.' });
    }
};


const deletePropertyDetails = async (req, res) => {
    try {
      const propertyId = req.params.id;
  
      if (!propertyId) {
        return res.status(400).json({ message: 'Missing required parameters.' });
      }
  
      const deletedProperty = await Property.findByIdAndDelete(propertyId);
  
      if (!deletedProperty) {
        return res.status(404).json({ message: 'Property not found.' });
      }
  
      res.status(200).json({ message: 'Property deleted successfully.', deletedProperty });
    } catch (error) {
      console.error('Error deleting property:', error);
      res.status(500).json({ message: 'Failed to delete property.' });
    }
  };

const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find();

        if (!properties ) {
            res.status(404).json({ message: 'No properties found.' });
            return;
        }

        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).json({ message: 'Failed to fetch property details.' });
    }
};


module.exports = {
    addPropertyDetails,
    updatePropertyDetails,
    getAllProperties,
    deletePropertyDetails,

};
