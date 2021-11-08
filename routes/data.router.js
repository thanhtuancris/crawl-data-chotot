  
const express = require('express');
const router = express.Router();
const dataController = require('../controller/data.controller');

router.post('/cuahang', dataController.cuahang);
router.post('/canhan', dataController.canhan);
router.post('/get-all', dataController.getAll);
router.post('/push-noti', dataController.push_noti_by_area);

module.exports = router;