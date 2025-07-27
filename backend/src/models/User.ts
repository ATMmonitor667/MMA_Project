import pool from '../../config/db';
import bcrypt from 'bcryptjs';

export interface User {
  user_id?: number;
  username: string;
  email: string;
  password_hash: string;
  display_name?: string;
  role: 'user' | 'admin';
  created_at?: Date;
  updated_at?: Date;
}

export interface UserWithoutPassword {
  user_id: number;
  username: string;
  email: string;
  display_name?: string;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;
}

// Helper function to hash passwords
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Helper function to verify passwords
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Create users table if it doesn't exist
export async function createUserTable(): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS app_user (
      user_id        SERIAL PRIMARY KEY,
      username       VARCHAR(50)  NOT NULL UNIQUE,
      email          VARCHAR(254) NOT NULL UNIQUE,
      password_hash  TEXT         NOT NULL,
      display_name   VARCHAR(100) NULL,
      role           VARCHAR(20)  DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      created_at     TIMESTAMPTZ  DEFAULT now(),
      updated_at     TIMESTAMPTZ  DEFAULT now()
    );
  `;

  try {
    await pool.query(query);
    console.log('app_user table created or already exists');
  } catch (error) {
    console.error('Error creating app_user table:', error);
    throw error;
  }
}

// Create a new user
export async function createUser(userData: Omit<User, 'user_id' | 'created_at' | 'updated_at'>): Promise<UserWithoutPassword> {
  const { username, email, password_hash, display_name, role } = userData;

  const query = `
    INSERT INTO app_user (username, email, password_hash, display_name, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING user_id, username, email, display_name, role, created_at, updated_at
  `;

  try {
    const result = await pool.query(query, [username, email, password_hash, display_name, role]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  const query =
  `SELECT * FROM app_user
  WHERE email = $1`;

  try {
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

// Find user by username
export async function findUserByUsername(username: string): Promise<User | null> {
  const query =
  `SELECT * FROM app_user
  WHERE username = $1`;

  try {
    const result = await pool.query(query, [username]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by username:', error);
    throw error;
  }
}

// Find user by ID
export async function findUserById(id: number): Promise<UserWithoutPassword | null> {
  const query =
  `SELECT user_id, username, email, display_name, role, created_at, updated_at
   FROM app_user WHERE user_id = $1`;

  try {
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
}

// Update user
export async function updateUser(id: number, updates: Partial<Omit<User, 'user_id' | 'created_at' | 'updated_at'>>): Promise<UserWithoutPassword | null> {
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) return null;

  // Hash password if it's being updated
  let finalValues = [...values];
  const passwordIndex = fields.indexOf('password_hash');
  if (passwordIndex !== -1) {
    const saltRounds = 12;
    finalValues[passwordIndex] = await bcrypt.hash(values[passwordIndex] as string, saltRounds);
  }

  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  const query = `
    UPDATE app_user
    SET ${setClause}, updated_at = now()
    WHERE user_id = $1
    RETURNING user_id, username, email, display_name, role, created_at, updated_at
  `;

  try {
    const result = await pool.query(query, [id, ...finalValues]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Delete user
export async function deleteUser(id: number): Promise<boolean> {
  const query = `
  DELETE FROM app_user
  WHERE user_id = $1`;

  try {
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Get all users (admin only)
export async function findAllUsers(): Promise<UserWithoutPassword[]> {
  const query = `
  SELECT user_id, username, email, display_name, role, created_at, updated_at
  FROM app_user
  ORDER BY created_at DESC`;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error finding all users:', error);
    throw error;
  }
}