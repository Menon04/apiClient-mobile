const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticateToken);
router.get('/profile', userController.getProfileByEmail);
router.put('/update', userController.updateProfile);
router.delete('/delete', userController.deleteProfile);

module.exports = router;