import { FastifyInstance } from 'fastify';

import { authenticateWithPassword } from './auth/authenticate-with-password';
import { createAccount } from './auth/create-account';
import { getProfile } from './auth/get-profile';

export async function routes(app: FastifyInstance) {
  app.register(createAccount);
  app.register(authenticateWithPassword);
  app.register(getProfile);
}
