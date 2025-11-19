import { FastifyInstance } from 'fastify';

import { createOrganization } from './create-organization';

export async function orgsRoutes(app: FastifyInstance) {
  app.register(createOrganization);
}
