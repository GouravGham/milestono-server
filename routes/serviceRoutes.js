const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

router.post('/serviceman_details', serviceController.createServiceman);
router.post('/problem_details', serviceController.createProblem);
router.get('/serviceman_details', serviceController.getAllServiceman);
router.get('/problem_details', serviceController.getAllProblems);
router.put('/accept_serviceman/:id',serviceController.acceptServiceman);
router.delete('/delete_serviceman/:id',serviceController.deleteServiceman);
router.put('/vendor_servicerequest/:id',serviceController.venderServiceRequest);
router.put('/admin_servicerequest/:id',serviceController.adminServiceRequest);
router.put('/pending_servicerequest/:id',serviceController.pendingServiceRequest);
router.put('/accept_servicerequest/:id',serviceController.acceptServiceRequest);

module.exports = router;
