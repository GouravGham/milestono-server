const Serviceman = require('../models/serviceman');
const ServiceRequest = require('../models/servicerequest');
const jwt = require('jsonwebtoken');

const createServiceman = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const {
        vendorImage,
        adharImage,
        panImage,
        certificateImage,
        serviceRoll,
        vendorDescription,
        experience,
        district,
        state,
        subDistrict,
        address,
      } = req.body.formData;

      const status = "pending";

      const newServiceman = new Serviceman({
        vendorImage,
        adharImage,
        panImage,
        certificateImage,
        serviceRoll,
        vendorDescription,
        experience,
        district,
        state,
        subDistrict,
        address,
        status,
        email: decoded.email,
      });

      try {
        const savedServiceman = await newServiceman.save();
        res.status(201).json(savedServiceman);
      } catch (saveError) {
        res.status(500).json({ error: 'Error saving serviceman: ' + saveError.message });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

const createProblem = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const {
        address,
        name,
        problemDescription,
        problemImage,
        problemType,
      } = req.body.formData;

      const status = "pending";

      const newServiceRequest = new ServiceRequest({
        address,
        name,
        problemDescription,
        problemImage,
        problemType,
        status,
        email: decoded.email,
      });

      try {
        const savedServiceRequest = await newServiceRequest.save();
        res.status(201).json(savedServiceRequest);
      } catch (saveError) {
        res.status(500).json({ error: 'Error saving service request: ' + saveError.message });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

const getAllServiceman = async (req, res) => {
  try {
      const service = await Serviceman.find();

      if (!service ) {
          res.status(404).json({ message: 'No Service mans found.' });
          return;
      }

      res.status(200).json(service);
  } catch (error) {
      console.error('Error fetching Service man details:', error);
      res.status(500).json({ message: 'Failed to fetch Service man details.' });
  }
};

const getAllProblems = async (req, res) => {
  try {
      const service = await ServiceRequest.find();

      if (!service ) {
          res.status(404).json({ message: 'No Service mans found.' });
          return;
      }

      res.status(200).json(service);
  } catch (error) {
      console.error('Error fetching Service man details:', error);
      res.status(500).json({ message: 'Failed to fetch Service man details.' });
  }
};

const venderServiceRequest = async (req, res) => {
  try {
      const serviceRequestId = req.params.id;
      const email = req.body.email;
      if ( !serviceRequestId) {
          return res.status(400).json({ message: 'Missing required parameters.' });
      }

      const updatedserviceRequest = await ServiceRequest.findByIdAndUpdate(
          serviceRequestId, 
          { status : "venderReview", vendorEmail : email }, 
          { new: true }
      );
      

      if (!updatedserviceRequest) {
          return res.status(404).json({ message: 'serviceRequest not found.' });
      }

      res.status(200).json({ message: 'serviceRequest details updated successfully.', serviceRequest: updatedserviceRequest });
  } catch (error) {
      console.error('Error updating serviceRequest details:', error);
      res.status(500).json({ message: 'Failed to update serviceRequest details.' });
  }
};

const adminServiceRequest = async (req, res) => {
  try {
      const serviceRequestId = req.params.id;
      const expectedPrice = req.body.expectedPrice;


      if ( !serviceRequestId) {
          return res.status(400).json({ message: 'Missing required parameters.' });
      }

      const updatedserviceRequest = await ServiceRequest.findByIdAndUpdate(
          serviceRequestId, 
          { status : "adminReview",expectedPrice}, 
          { new: true }
      );
      

      if (!updatedserviceRequest) {
          return res.status(404).json({ message: 'serviceRequest not found.' });
      }

      res.status(200).json({ message: 'serviceRequest details updated successfully.', serviceRequest: updatedserviceRequest });
  } catch (error) {
      console.error('Error updating serviceRequest details:', error);
      res.status(500).json({ message: 'Failed to update serviceRequest details.' });
  }
};

const pendingServiceRequest = async (req, res) => {
  try {
      const serviceRequestId = req.params.id;


      if ( !serviceRequestId) {
          return res.status(400).json({ message: 'Missing required parameters.' });
      }

      const updatedserviceRequest = await ServiceRequest.findByIdAndUpdate(
          serviceRequestId, 
          { status : "pending" }, 
          { new: true }
      );
      

      if (!updatedserviceRequest) {
          return res.status(404).json({ message: 'serviceRequest not found.' });
      }

      res.status(200).json({ message: 'serviceRequest details updated successfully.', serviceRequest: updatedserviceRequest });
  } catch (error) {
      console.error('Error updating serviceRequest details:', error);
      res.status(500).json({ message: 'Failed to update serviceRequest details.' });
  }
};

const acceptServiceRequest = async (req, res) => {
  try {
      const serviceRequestId = req.params.id;


      if ( !serviceRequestId) {
          return res.status(400).json({ message: 'Missing required parameters.' });
      }

      const updatedserviceRequest = await ServiceRequest.findByIdAndUpdate(
          serviceRequestId, 
          { status : "accepted" }, 
          { new: true }
      );
      

      if (!updatedserviceRequest) {
          return res.status(404).json({ message: 'serviceRequest not found.' });
      }

      res.status(200).json({ message: 'serviceRequest details updated successfully.', serviceRequest: updatedserviceRequest });
  } catch (error) {
      console.error('Error updating serviceRequest details:', error);
      res.status(500).json({ message: 'Failed to update serviceRequest details.' });
  }
};

const acceptServiceman = async (req, res) => {
  try {
      const servicemanId = req.params.id;


      if ( !servicemanId) {
          return res.status(400).json({ message: 'Missing required parameters.' });
      }

      const updatedServiceman = await Serviceman.findByIdAndUpdate(
          servicemanId, 
          { status : "accepted" }, 
          { new: true }
      );
      

      if (!updatedServiceman) {
          return res.status(404).json({ message: 'Serviceman not found.' });
      }

      res.status(200).json({ message: 'Serviceman details updated successfully.', serviceman: updatedServiceman });
  } catch (error) {
      console.error('Error updating serviceman details:', error);
      res.status(500).json({ message: 'Failed to update serviceman details.' });
  }
};

const deleteServiceman = async (req, res) => {
  try {
    const servicemanId = req.params.id;

    if (!servicemanId) {
      return res.status(400).json({ message: 'Missing required parameters.' });
    }

    const deletedServiceman = await Serviceman.findByIdAndDelete(servicemanId);

    if (!deletedServiceman) {
      return res.status(404).json({ message: 'Serviceman not found.' });
    }

    res.status(200).json({ message: 'Serviceman deleted successfully.', deletedServiceman });
  } catch (error) {
    console.error('Error deleting serviceman:', error);
    res.status(500).json({ message: 'Failed to delete serviceman.' });
  }
};

module.exports = {
  createServiceman,
  getAllServiceman,
  acceptServiceman,
  deleteServiceman,
  createProblem,
  getAllProblems,
  adminServiceRequest,
  venderServiceRequest,
  pendingServiceRequest,
  acceptServiceRequest,
};