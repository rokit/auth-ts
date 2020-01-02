import sgr from './jsonResponse';
import {OAuth2Client} from 'google-auth-library';
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket';

const oathClient = "131808800218-t958n7gtqll3tkctopu8245846ovfg8m.apps.googleusercontent.com";
const client = new OAuth2Client(oathClient);

export const gglVerify = async (token: string): Promise<TokenPayload> => {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: oathClient
  });
  const payload = ticket.getPayload();
  if (!payload) throw sgr.internalError();
  return payload;
}
