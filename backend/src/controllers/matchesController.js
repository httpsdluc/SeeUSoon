const pool = require('../db');

// Like a student
const likeStudent = async (req, res) => {
  try {
    const { liker_id, liked_id } = req.body;

    // Can't like yourself
    if (liker_id === liked_id) {
      return res.status(400).json({ error: "You can't like yourself" });
    }

    // Insert the like
    await pool.query(
      'INSERT INTO likes (liker_id, liked_id) VALUES ($1, $2) ON CONFLICT (liker_id, liked_id) DO NOTHING',
      [liker_id, liked_id]
    );

    // Check if it's a mutual match (did they like us back?)
    const mutualCheck = await pool.query(
      'SELECT * FROM likes WHERE liker_id = $1 AND liked_id = $2',
      [liked_id, liker_id]
    );

    if (mutualCheck.rows.length > 0) {
      // It's a match! Create match record
      await pool.query(
        'INSERT INTO matches (student1_id, student2_id, status) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [Math.min(liker_id, liked_id), Math.max(liker_id, liked_id), 'matched']
      );

      // Get the matched person's info
      const matchedPerson = await pool.query(
        'SELECT id, name, profile_photo, school, major FROM students WHERE id = $1',
        [liked_id]
      );

      return res.json({ 
        match: true, 
        message: "It's a match! 🎉",
        matchedUser: matchedPerson.rows[0]
      });
    }

    res.json({ match: false, message: 'Like recorded!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pass on a student
const passStudent = async (req, res) => {
  try {
    res.json({ message: 'Passed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all matches for a student - FIXED VERSION
const getMatches = async (req, res) => {
  try {
    const { student_id } = req.params;

    const result = await pool.query(
      `SELECT 
        s.id, s.name, s.school, s.major, s.year, s.bio, s.profile_photo, s.interests,
        m.matched_at
      FROM matches m
      JOIN students s ON (
        CASE 
          WHEN m.student1_id = $1 THEN s.id = m.student2_id
          ELSE s.id = m.student1_id
        END
      )
      WHERE (m.student1_id = $1 OR m.student2_id = $1)
      AND m.status = 'matched'
      ORDER BY m.matched_at DESC`,
      [student_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  likeStudent,
  passStudent,
  getMatches
};
