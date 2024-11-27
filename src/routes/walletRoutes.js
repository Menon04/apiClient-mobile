const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken);
router.post('/deposit', walletController.deposit);
router.post('/withdraw', walletController.withdraw);
router.get('/balance', walletController.getBalance);

module.exports = router;