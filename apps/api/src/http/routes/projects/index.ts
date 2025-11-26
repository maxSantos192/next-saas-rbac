import { FastifyInstance } from 'fastify';

import { createProject } from './create-project';
import { getProject } from './get-project';
import { getProjects } from './get-projects';
import { updateProject } from './update-project';

export async function projectsRoutes(app: FastifyInstance) {
  app.register(createProject);
  app.register(getProject);
  app.register(getProjects);
  app.register(updateProject);
}
