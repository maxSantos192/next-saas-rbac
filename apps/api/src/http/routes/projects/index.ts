import { FastifyInstance } from 'fastify';

import { createProject } from './create-project';

export async function projectsRoutes(app: FastifyInstance) {
  app.register(createProject);
}
