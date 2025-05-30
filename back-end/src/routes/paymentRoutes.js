const express = require('express');
const router = express.Router();
const { generateVietQR } = require('../controllers/PaymentController');

router.post('/create',  generateVietQR);

module.exports = router;
