const express = require('express');
const router = express.Router();
const tickerController = require('../controllers/tickerController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/quote/:tickers', authenticateToken, tickerController.getQuote);
router.get('/search/:symbol', authenticateToken, tickerController.searchAndCreateTicker);

module.exports = router;