import { FastifyInstance } from 'fastify';

import { getMembers } from './get-members';

export async function membersRoutes(app: FastifyInstance) {
  app.register(getMembers);
}
