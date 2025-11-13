const pool = require('../db');

// Get all students (for browsing/matching)
const getAllStudents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, school, major, year, interests, hobbies, bio, profile_photo, looking_for,
       gender, sexual_orientation, date_of_birth,
       prompt1_question, prompt1_answer, prompt2_question, prompt2_answer 
       FROM students ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, name, email, school, major, year, interests, hobbies, 
       favorite_shows, favorite_movies, favorite_books, favorite_music, 
       bio, profile_photo, looking_for, gender, sexual_orientation, date_of_birth, created_at,
       prompt1_question, prompt1_answer, prompt2_question, prompt2_answer 
       FROM students WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new student (signup)
const createStudent = async (req, res) => {
  try {
    const { 
      email, name, password, school, major, year, 
      gender, sexual_orientation, date_of_birth,
      interests, hobbies, favorite_shows, favorite_movies, 
      favorite_books, favorite_music, bio, looking_for, profile_photo,
      prompt1_question, prompt1_answer, prompt2_question, prompt2_answer
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO students 
       (email, name, password_hash, school, major, year, gender, sexual_orientation, date_of_birth,
        interests, hobbies, favorite_shows, favorite_movies, favorite_books, favorite_music, 
        bio, looking_for, profile_photo, prompt1_question, prompt1_answer, prompt2_question, prompt2_answer) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) 
       RETURNING id, name, email, school, major, year, gender, sexual_orientation, date_of_birth`,
      [email, name, password, school, major, year, gender, sexual_orientation, date_of_birth,
       interests, hobbies, favorite_shows, favorite_movies, favorite_books, favorite_music, 
       bio, looking_for, profile_photo, prompt1_question, prompt1_answer, prompt2_question, prompt2_answer]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login student
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query(
      `SELECT id, name, email, school, major, year, interests, hobbies, bio, profile_photo, 
       looking_for, gender, sexual_orientation, date_of_birth, prompt1_answer, prompt2_answer 
       FROM students WHERE email = $1 AND password_hash = $2`,
      [email, password]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update student profile
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      bio, interests, hobbies, favorite_shows, favorite_movies, 
      favorite_books, favorite_music, prompt1_question, prompt1_answer, 
      prompt2_question, prompt2_answer, profile_photo 
    } = req.body;
    
    const result = await pool.query(
      `UPDATE students 
       SET bio = $1, interests = $2, hobbies = $3, 
           favorite_shows = $4, favorite_movies = $5, favorite_books = $6, favorite_music = $7,
           prompt1_question = $8, prompt1_answer = $9, prompt2_question = $10, prompt2_answer = $11,
           profile_photo = $12
       WHERE id = $13
       RETURNING id, name, email, school, major, year, bio, interests, hobbies, 
                 favorite_shows, favorite_movies, favorite_books, favorite_music,
                 prompt1_question, prompt1_answer, prompt2_question, prompt2_answer, 
                 profile_photo, looking_for, gender, sexual_orientation, date_of_birth`,
      [bio, interests, hobbies, favorite_shows, favorite_movies, favorite_books, favorite_music,
       prompt1_question, prompt1_answer, prompt2_question, prompt2_answer, profile_photo, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  loginStudent,
  updateStudent
};
