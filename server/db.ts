import { Pool } from 'pg';
import User from './user'
import auth from './authHelpers';
import sgr from './jsonResponse';

const databaseUrl = process.env.SGDB;

if (!databaseUrl) {
  throw "Cannot get database url.";
}

const pool = new Pool({
  connectionString: databaseUrl,
  max: 3
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
});

const addUser = async (user: User): Promise<number> => {
  let sql = "CALL add_user($1, $2, $3);";
  try {
    let res = await pool.query(sql, [user.email, user.username, user.password]);
    return res.rows[0];
  } catch (err) {
    if (err.constraint === "users_username_key") {
      throw sgr.error(500, 10, "username", "This username has already been taken.");
    }
    if (err.constraint === "users_email_key") {
      throw sgr.error(500, 11, "signupEmail", "This email has already been registered.");
    }
    throw sgr.internalError();
  }
}

const userExists = async (username: string): Promise<number> => {
  let sql = "SELECT id FROM users WHERE username=$1 OR email=$1";
  try {
    let res = await pool.query(sql, [username]);
    if (res.rows.length === 0) {
      return 0;
    }
    return res.rows[0].id;
  } catch (err) {
    throw sgr.internalError();
  }
}

const verifyUser = async (user: User): Promise<string> => {
  let sql = "SELECT username, password FROM users WHERE email=$1";
  let hashed_password = "";
  let username = "";

  try {
    let res = await pool.query(sql, [user.email]);
    res.rows.map((row) => {
      username = row.username;
      hashed_password = row.password;
    });
  } catch (err) {
    throw sgr.internalError();
  }

  if (await auth.verifyHash(hashed_password, user.password)) {
    return username;
  } else {
    throw sgr.error(400, 23, "signin", "Email/password combo not found.");
  }
}

const getUserByEmail = async (email: string): Promise<string> => {
  try {
    let dbres = await pool.query("SELECT username FROM users WHERE email=$1", [email]);
    if (dbres.rows.length === 0) {
      // return ok even if user isn't found
      // ecurity through obscurity
      return "";
    }
    let username = "";
    dbres.rows.map((row) => {
      username = row.username;
    })
    return username;
  } catch (err) {
    throw sgr.internalError();
  }
}

const updateUserPassword = async (username: string, password: string): Promise<number> => {
  let sql = "UPDATE users SET password = $1 WHERE username=$2";
  try {
    let dbres = await pool.query(sql, [password, username]);
    return dbres.rowCount;
  } catch (err) {
    throw sgr.internalError();
  }
}


const db = {
  // auth
  addUser,
  userExists,
  verifyUser,
  getUserByEmail,
  updateUserPassword,
}

export default db;
