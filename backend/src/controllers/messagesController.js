const pool = require('../db');

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { sender_id, receiver_id, message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Check if they're matched (can only message matches)
    const matchCheck = await pool.query(
      `SELECT * FROM matches 
       WHERE (student1_id = $1 AND student2_id = $2) 
       OR (student1_id = $2 AND student2_id = $1)`,
      [Math.min(sender_id, receiver_id), Math.max(sender_id, receiver_id)]
    );

    if (matchCheck.rows.length === 0) {
      return res.status(403).json({ error: 'You can only message your matches' });
    }

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, message) 
       VALUES ($1, $2, $3) 
       RETURNING id, sender_id, receiver_id, message, created_at, read`,
      [sender_id, receiver_id, message]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get conversation between two users
const getConversation = async (req, res) => {
  try {
    const { user_id, other_user_id } = req.params;

    const result = await pool.query(
      `SELECT m.*, 
        s1.name as sender_name, 
        s2.name as receiver_name
       FROM messages m
       JOIN students s1 ON m.sender_id = s1.id
       JOIN students s2 ON m.receiver_id = s2.id
       WHERE (m.sender_id = $1 AND m.receiver_id = $2) 
       OR (m.sender_id = $2 AND m.receiver_id = $1)
       ORDER BY m.created_at ASC`,
      [user_id, other_user_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all conversations for a user
const getConversations = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await pool.query(
      `SELECT DISTINCT ON (other_user_id)
        other_user_id,
        other_user_name,
        other_user_photo,
        last_message,
        last_message_time
       FROM (
         SELECT 
           CASE 
             WHEN m.sender_id = $1 THEN m.receiver_id 
             ELSE m.sender_id 
           END as other_user_id,
           CASE 
             WHEN m.sender_id = $1 THEN s2.name 
             ELSE s1.name 
           END as other_user_name,
           CASE 
             WHEN m.sender_id = $1 THEN s2.profile_photo 
             ELSE s1.profile_photo 
           END as other_user_photo,
           m.message as last_message,
           m.created_at as last_message_time
         FROM messages m
         JOIN students s1 ON m.sender_id = s1.id
         JOIN students s2 ON m.receiver_id = s2.id
         WHERE m.sender_id = $1 OR m.receiver_id = $1
         ORDER BY m.created_at DESC
       ) conversations
       ORDER BY other_user_id, last_message_time DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { user_id, other_user_id } = req.params;

    await pool.query(
      `UPDATE messages 
       SET read = true 
       WHERE receiver_id = $1 AND sender_id = $2 AND read = false`,
      [user_id, other_user_id]
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead
};
