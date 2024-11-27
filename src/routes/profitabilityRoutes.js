const express = require('express');
const router = express.Router();
const profitabilityController = require('../controllers/profitabilityController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken);
router.get('/monthly', profitabilityController.getMonthlyReturns);

module.exports = router;