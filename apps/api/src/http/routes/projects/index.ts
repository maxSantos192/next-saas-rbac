import { FastifyInstance } from 'fastify';

import { createProject } from './create-project';
import { getProject } from './get-project';

export async function projectsRoutes(app: FastifyInstance) {
  app.register(createProject);
  app.register(getProject);
}
