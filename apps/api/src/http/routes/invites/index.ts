import { FastifyInstance } from 'fastify';

import { createInvite } from './create-invite';

export async function invitesRoutes(app: FastifyInstance) {
  app.register(createInvite);
}
