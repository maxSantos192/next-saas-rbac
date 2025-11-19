import { FastifyInstance } from 'fastify';

import { createOrganization } from './create-organization';
import { getMembership } from './get-membership';

export async function orgsRoutes(app: FastifyInstance) {
  app.register(createOrganization);
  app.register(getMembership);
}
