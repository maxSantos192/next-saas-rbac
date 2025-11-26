import { FastifyInstance } from 'fastify';

import { createInvite } from './create-invite';
import { getInvite } from './get-invite';

export async function invitesRoutes(app: FastifyInstance) {
  app.register(createInvite);
  app.register(getInvite);
}
