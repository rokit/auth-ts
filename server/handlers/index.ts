import express from 'express';
import * as hn from './auth';

const handlers = (app: express.Application) => {
  app.post('/auth/add-user', hn.addUser);
  app.post('/auth/check-username', hn.checkUsername);
  app.post('/auth/verify-user', hn.verifyUser);
  app.post('/auth/forgot-password', hn.forgotPassword);
  app.post('/auth/reset-password', hn.resetPassword);
  app.post('/auth/google', hn.google);
}

export default handlers;
