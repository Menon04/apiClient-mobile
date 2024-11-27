const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/github', authController.githubLogin);
router.get('/github/callback', authController.githubCallback);

module.exports = router;