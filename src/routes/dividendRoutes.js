const express = require('express');
const router = express.Router();
const dividendController = require('../controllers/dividendController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/process', authenticateToken, dividendController.processDividends);
router.get('/history/:portfolioId', authenticateToken, dividendController.getDividendHistory);

module.exports = router;