import User from '../user';
import { Request, Response } from "express";
import argon2 from 'argon2';
import sgr from '../jsonResponse';
import db from '../db';
import auth from '../authHelpers';
import { gglVerify } from '../authGoogle';
import { v4 as uuidv4 } from 'uuid';
import { sendForgotEmail } from '../sendGrid';
import helpers from './helpers';

export const addUser = async (req: Request, res: Response, next: any) => {
  let user = new User(req.body.email, req.body.username, req.body.password);
  try { user.isValidSignup(); } catch (err) { return next(err); }
  try { user.password = await argon2.hash(user.password); } catch {
    throw sgr.internalError();
  }

  try {
    await db.addUser(user);
    res.json(sgr.success("signup", "Success!"));
  } catch (err) {
    next(err);
  }
}

export const checkUsername = async (req: Request, res: Response, next: any) => {
  let user = new User(req.body.email, req.body.username, req.body.password);
  try {
    let exists = await db.userExists(user.username);
    if (exists > 0) {
      throw sgr.error(500, 13, "username", "This username has already been taken.");
    }
    res.json(sgr.success("usernameCheck", "Username available."));
  } catch (err) {
    next(err);
  }
}

export const verifyUser = async (req: Request, res: Response, next: any) => {
  let user = new User(req.body.email, req.body.username, req.body.password);
  try {
    user.isValidSignin();
    let username = await db.verifyUser(user);
    let token = auth.createToken(username, "14d");
    res.json(sgr.success("signin", token));
  } catch (err) {
    return next(err);
  }
}

export const google = async (req: Request, res: Response, next: any) => {
  let token = req.body.id_token;
  // decode the google token or throw an error
  let gglPayload = await gglVerify(token);

  if (!gglPayload.email) {
    throw sgr.error(500, 30, "google", "Can't login because it appears your Google account doesn't have an email associated with it.");
  }
  if (!gglPayload.given_name) {
    gglPayload.given_name = "user-" + uuidv4();
  }

  // create User from token data
  let user = new User(gglPayload.email, gglPayload.given_name, "");

  try {
    // check if user exists in our db
    let id = await db.userExists(user.email);

    if (id === 0) {
      // if user doesn't exist, create a new user
      await db.addUser(user);
    }
    // todo: prevent google users from changing their username
    let sgToken = auth.createToken(user.username, '14d');
    res.json(sgr.success("signin", sgToken));
  } catch (err) {
    next(err);
  }
}

export const forgotPassword = async (req: Request, res: Response, next: any) => {
  let user = new User(req.body.email, req.body.username, req.body.password);
  try {
    // check if the email is valid
    user.isValidEmail("forgotPassword");

    // if the email exists in the database,
    // then the username is returned
    let username = await db.getUserByEmail(user.email);

    // if username is not empty, send a password reset email
    if (username !== "") {
      let token = auth.createToken(username, '1d');
      sendForgotEmail(user.email, token, username);
    }

    // return ok even if the username is empty
    // security through obscurity
    res.json(sgr.success("forgotPassword", "Email sent!"));
  } catch (err) {
    next(err);
  }
}

export const resetPassword = async (req: Request, res: Response, next: any) => {
  let user = new User(req.body.email, req.body.username, req.body.password);

  try {
    user.isValidPassword("reset");
  } catch (err) {
    return next(err);
  }

  try {
    let token = helpers.getAuthorizationHeader(req);
    let claims: any = auth.decodeToken(token);
    let hashedPassword = await auth.createHash(user.password);
    let rowCount = await db.updateUserPassword(claims.sub, hashedPassword);

    if (rowCount != 0) {
      let token = auth.createToken(user.username, '14d');
      res.json(sgr.success("resetPassword", token));
    } else {
      throw sgr.internalError("No rows modified for updating password.");
    }
  } catch (err) {
    return next(err);
  }
}
