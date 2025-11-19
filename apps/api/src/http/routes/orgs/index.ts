import { FastifyInstance } from 'fastify';

import { createOrganization } from './create-organizarion';

export async function orgsRoutes(app: FastifyInstance) {
  app.register(createOrganization);
}
