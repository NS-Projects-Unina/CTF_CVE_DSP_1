import { db } from './db';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  username: string;
  password: string;
  isAdmin: boolean;
}

export async function addUser(username: string, password: string, isAdmin = false): Promise<boolean> {
  try {
    const hashed = await bcrypt.hash(password, 10); // hash sicuro
    db.prepare('INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)').run(
      username,
      hashed,
      isAdmin ? 1 : 0
    );
    return true;
  } catch (e) {
    console.error(e);
    return false; // ad esempio username già esistente
  }
}


export async function checkUser(username: string, password: string): Promise<User | null> {
  const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!row) return null;

  const valid = await bcrypt.compare(password, row.password); // confronta hash
  if (!valid) return null;

  return {
    id: row.id,
    username: row.username,
    password: row.password,
    isAdmin: !!row.isAdmin
  };
}


export function getUser(username: string): User | null {
  const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!row) return null;
  return { id: row.id, username: row.username, password: row.password, isAdmin: !!row.isAdmin };
}
