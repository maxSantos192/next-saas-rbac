import { FastifyInstance } from 'fastify';

import { getOrganizationBilling } from './get-organization-billing';

export async function billingRoutes(app: FastifyInstance) {
  app.register(getOrganizationBilling);
}
