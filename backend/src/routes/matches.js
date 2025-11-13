const express = require('express');
const router = express.Router();
const { likeStudent, passStudent, getMatches } = require('../controllers/matchesController');

router.post('/like', likeStudent);
router.post('/pass', passStudent);
router.get('/:student_id', getMatches);

module.exports = router;
