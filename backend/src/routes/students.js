const express = require('express');
const router = express.Router();
const { 
  getAllStudents, 
  getStudentById, 
  createStudent, 
  loginStudent,
  updateStudent 
} = require('../controllers/studentsController');

router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.post('/login', loginStudent);
router.put('/:id', updateStudent);

module.exports = router;
