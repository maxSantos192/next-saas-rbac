import { FastifyInstance } from 'fastify';

import { createProject } from './create-project';
import { getProject } from './get-project';
import { getProjects } from './get-projects';

export async function projectsRoutes(app: FastifyInstance) {
  app.register(createProject);
  app.register(getProject);
  app.register(getProjects);
}
