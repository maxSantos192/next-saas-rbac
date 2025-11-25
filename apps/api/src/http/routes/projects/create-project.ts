import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import { createSlug } from '@/utils/create-slug';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { UnauthorizedError } from '../_errors/unauthorized-error';

export async function createProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/projects',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Create a new project',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.object({
              projectId: z.uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const userId = await request.getCurrentUserId();
        const { organization, membership } =
          await request.getUserMemberShip(slug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('create', 'Project')) {
          throw new UnauthorizedError(
            `you're not allowed to create new project.`
          );
        }

        const { name, description } = request.body;

        const project = await prisma.project.create({
          data: {
            name,
            description,
            slug: createSlug(name),
            organizationId: organization.id,
            ownerId: userId,
          },
        });

        return reply.status(204).send({ projectId: project.id });
      }
    );
}
