const pool = require('../db');

// Set user availability
const setAvailability = async (req, res) => {
  try {
    const { student_id, day_of_week, start_time, end_time } = req.body;

    const result = await pool.query(
      `INSERT INTO availability (student_id, day_of_week, start_time, end_time) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (student_id, day_of_week, start_time, end_time) 
       DO UPDATE SET start_time = $3, end_time = $4
       RETURNING *`,
      [student_id, day_of_week, start_time, end_time]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user availability
const getAvailability = async (req, res) => {
  try {
    const { student_id } = req.params;

    const result = await pool.query(
      `SELECT * FROM availability WHERE student_id = $1 ORDER BY day_of_week, start_time`,
      [student_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete availability slot
const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM availability WHERE id = $1', [id]);

    res.json({ message: 'Availability deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get mutual availability between two users
const getMutualAvailability = async (req, res) => {
  try {
    const { student1_id, student2_id } = req.params;

    const result = await pool.query(
      `SELECT DISTINCT
        a1.day_of_week,
        GREATEST(a1.start_time, a2.start_time) as start_time,
        LEAST(a1.end_time, a2.end_time) as end_time
       FROM availability a1
       JOIN availability a2 ON a1.day_of_week = a2.day_of_week
       WHERE a1.student_id = $1 
       AND a2.student_id = $2
       AND a1.start_time < a2.end_time
       AND a1.end_time > a2.start_time
       ORDER BY a1.day_of_week, start_time`,
      [student1_id, student2_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a meetup
const createMeetup = async (req, res) => {
  try {
    const { student1_id, student2_id, title, location, meetup_date, meetup_time, created_by } = req.body;

    const result = await pool.query(
      `INSERT INTO meetups (student1_id, student2_id, title, location, meetup_date, meetup_time, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [student1_id, student2_id, title, location, meetup_date, meetup_time, created_by]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's meetups
const getMeetups = async (req, res) => {
  try {
    const { student_id } = req.params;

    const result = await pool.query(
      `SELECT m.*,
        CASE 
          WHEN m.student1_id = $1 THEN s2.name
          ELSE s1.name
        END as other_user_name,
        CASE 
          WHEN m.student1_id = $1 THEN s2.profile_photo
          ELSE s1.profile_photo
        END as other_user_photo,
        CASE 
          WHEN m.student1_id = $1 THEN m.student2_id
          ELSE m.student1_id
        END as other_user_id
       FROM meetups m
       JOIN students s1 ON m.student1_id = s1.id
       JOIN students s2 ON m.student2_id = s2.id
       WHERE (m.student1_id = $1 OR m.student2_id = $1)
       AND m.status != 'cancelled'
       ORDER BY m.meetup_date ASC, m.meetup_time ASC`,
      [student_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update meetup status
const updateMeetupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE meetups 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  setAvailability,
  getAvailability,
  deleteAvailability,
  getMutualAvailability,
  createMeetup,
  getMeetups,
  updateMeetupStatus
};
