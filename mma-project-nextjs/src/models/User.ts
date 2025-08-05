import pool from '@/lib/db';

// Simple user interface for basic functionality (no auth)
export interface User {
  user_id?: number;
  username: string;
  email: string;
  display_name?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Create a simple users table (no password, no roles)
export async function createUserTable(): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS app_user (
      user_id        SERIAL PRIMARY KEY,
      username       VARCHAR(50)  NOT NULL UNIQUE,
      email          VARCHAR(254) NOT NULL UNIQUE,
      display_name   VARCHAR(100) NULL,
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

// Create a simple user (no password)
export async function createUser(userData: Omit<User, 'user_id' | 'created_at' | 'updated_at'>): Promise<User> {
  const { username, email, display_name } = userData;

  const query = `
    INSERT INTO app_user (username, email, display_name)
    VALUES ($1, $2, $3)
    RETURNING user_id, username, email, display_name, created_at, updated_at
  `;

  try {
    const result = await pool.query(query, [username, email, display_name]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  const query = `SELECT * FROM app_user WHERE email = $1`;

  try {
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

// Find user by ID
export async function findUserById(id: number): Promise<User | null> {
  const query = `SELECT * FROM app_user WHERE user_id = $1`;

  try {
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
}

// Get all users
export async function findAllUsers(): Promise<User[]> {
  const query = `
    SELECT user_id, username, email, display_name, created_at, updated_at
    FROM app_user
    ORDER BY created_at DESC
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error finding all users:', error);
    throw error;
  }
}
