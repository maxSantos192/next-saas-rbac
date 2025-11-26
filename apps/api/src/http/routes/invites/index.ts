import { FastifyInstance } from 'fastify';

import { acceptInvite } from './accept-invite';
import { createInvite } from './create-invite';
import { getInvite } from './get-invite';
import { getInvites } from './get-invites';
import { rejectInvite } from './reject-invite';
import { revokeInvite } from './revoke-invite';

export async function invitesRoutes(app: FastifyInstance) {
  app.register(acceptInvite);
  app.register(createInvite);
  app.register(getInvite);
  app.register(getInvites);
  app.register(rejectInvite);
  app.register(revokeInvite);
}
