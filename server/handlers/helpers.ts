import express from 'express';
import sgr from '../jsonResponse';

const getAuthorizationHeader = (req: express.Request): string => {
  let authHeader = req.headers.authorization;
  if (!authHeader) throw sgr.internalError("Authorization header was not received for password reset.");
  return authHeader.slice(7);
}

const helpers = {
  getAuthorizationHeader,
}

export default helpers;
