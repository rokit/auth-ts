import argon2 from 'argon2';
import sgr from './jsonResponse';
import jwt from 'jsonwebtoken';

const AUTH_APP = "Auth App";
const jwtSecret = process.env.SG_JWT_SECRET;

if (!jwtSecret) {
  throw "Can't get jwt secret.";
}

interface Claims {
  sub: string,
  iss: string,
  nbf: number,
}

const createHash = async (password: string): Promise<string> => {
  try {
    return await argon2.hash(password);
  } catch {
    throw sgr.internalError();
  }
}

const verifyHash = async (hash: string, password: string): Promise<boolean> => {
  try {
    return await argon2.verify(hash, password);
  } catch (err) {
    return false;
  }
}

const createToken = (username: string, duration: string): string => {
  let claims: Claims = {
    sub: username,
    iss: AUTH_APP,
    nbf: Math.floor(Date.now() / 1000)
  };
  return jwt.sign(claims, jwtSecret, { expiresIn: duration });
}

const decodeToken = (token: string) => {
  let validation = {
    issuer: AUTH_APP,
  }

  try {
    let claims = jwt.verify(token, jwtSecret, validation);
    return claims;
  } catch (err) {
    throw sgr.error(401, 41, "auth", "Please log in or sign up to access this resource.");
  }
}

const auth = {
  createHash,
  verifyHash,
  createToken,
  decodeToken,
}

export default auth;
