import { FastifyInstance } from 'fastify';

import { getMembers } from './get-members';
import { updateMember } from './update-member';

export async function membersRoutes(app: FastifyInstance) {
  app.register(getMembers);
  app.register(updateMember);
}
