const express = require('express');
const router = express.Router();
const { 
  setAvailability,
  getAvailability,
  deleteAvailability,
  getMutualAvailability,
  createMeetup,
  getMeetups,
  updateMeetupStatus
} = require('../controllers/scheduleController');

router.post('/availability', setAvailability);
router.get('/availability/:student_id', getAvailability);
router.delete('/availability/:id', deleteAvailability);
router.get('/mutual/:student1_id/:student2_id', getMutualAvailability);

router.post('/meetups', createMeetup);
router.get('/meetups/:student_id', getMeetups);
router.put('/meetups/:id', updateMeetupStatus);

module.exports = router;
