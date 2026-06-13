import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('kuwiz.db');

// Initialize database tables
export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Get all notes
export const getNotes = async () => {
  try {
    const result = await db.getAllAsync('SELECT * FROM notes ORDER BY created_at DESC');
    return result;
  } catch (error) {
    console.error('Error getting notes:', error);
    return [];
  }
};

// Add a new note
export const addNote = async (title, content) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO notes (title, content) VALUES (?, ?)',
      title,
      content
    );
    console.log('Note added with ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding note:', error);
    return null;
  }
};

// Update a note
export const updateNote = async (id, title, content) => {
  try {
    await db.runAsync(
      'UPDATE notes SET title = ?, content = ? WHERE id = ?',
      title,
      content,
      id
    );
    console.log('Note updated successfully:', id);
    return true;
  } catch (error) {
    console.error('Error updating note:', error);
    return false;
  }
};

// Delete a note
export const deleteNote = async (id) => {
  try {
    await db.runAsync('DELETE FROM notes WHERE id = ?', id);
    console.log('Note deleted successfully:', id);
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    return false;
  }
};