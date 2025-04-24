const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Legg til dine spørsmålsruter her
router.get('/', questionController.getAllQuestions);
router.post('/', questionController.createQuestion);

module.exports = router;
