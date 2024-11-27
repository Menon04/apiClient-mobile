const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/find', authenticateToken, portfolioController.getPortfolio);
router.post('/buy', authenticateToken, portfolioController.buyStock);
router.post('/sell', authenticateToken, portfolioController.sellStock);
router.get('/transactions', authenticateToken, portfolioController.getTransactions);

module.exports = router;