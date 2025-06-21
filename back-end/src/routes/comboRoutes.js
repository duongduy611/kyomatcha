const express = require('express');
const router = express.Router();
const ComboController = require('../controllers/comboController');

// Tất cả các route combos giống cấu trúc với products
router.get('/combo', ComboController.getAllCombos);
router.get('/combo/:comboId', ComboController.getComboById);
router.post('/combo', ComboController.createCombo);
router.put('/combo/:comboId', ComboController.updateCombo);
router.delete('/combo/:comboId', ComboController.deleteCombo);

module.exports = router;
