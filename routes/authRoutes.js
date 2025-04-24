const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');

// Registreringsruter
router.get('/register', authController.registerForm);
router.post(
  '/register',
  [
    check('username').notEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  authController.register
);

// Innloggingsruter
router.get('/login', authController.loginForm);
router.post('/login', authController.login);

// Utloggingsrute
router.get('/logout', authController.logout);

// Brukersletting
router.post('/delete-account', authController.deleteAccount);

module.exports = router; // Viktig at dette eksporteres
