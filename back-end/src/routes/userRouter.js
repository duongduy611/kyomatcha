const express = require("express");
const router = express.Router();
const { getUserPoints, getUserPointHistory, exchangePoints } = require('../controllers/UserController');

router.get('/:userId/points', getUserPoints);
router.get('/:userId/point-history', getUserPointHistory);
router.post('/:userId/exchange-points', exchangePoints);

module.exports = router;
