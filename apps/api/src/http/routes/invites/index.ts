import { FastifyInstance } from 'fastify';

import { acceptInvite } from './accept-invite';
import { createInvite } from './create-invite';
import { getInvite } from './get-invite';
import { getInvites } from './get-invites';

export async function invitesRoutes(app: FastifyInstance) {
  app.register(acceptInvite);
  app.register(createInvite);
  app.register(getInvite);
  app.register(getInvites);
}
