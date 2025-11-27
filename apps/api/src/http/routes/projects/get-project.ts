import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { BadRequestError } from '../_errors/bad-request-error';
import { UnauthorizedError } from '../_errors/unauthorized-error';

export async function getProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/projects/:projectSlug',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Get details from project',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string(),
          }),
          response: {
            200: z.object({
              project: z.object({
                id: z.uuid(),
                name: z.string(),
                description: z.string(),
                slug: z.string(),
                avatarUrl: z.url().nullable(),
                organizationId: z.uuid(),
                ownerId: z.uuid(),
                owner: z.object({
                  id: z.uuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.url().nullable(),
                }),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { orgSlug, projectSlug } = request.params;
        const userId = await request.getCurrentUserId();
        const { organization, membership } =
          await request.getUserMemberShip(orgSlug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('get', 'Project')) {
          throw new UnauthorizedError(
            `you're not allowed to see this project.`
          );
        }

        const project = await prisma.project.findFirst({
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            avatarUrl: true,
            organizationId: true,
            ownerId: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            slug: projectSlug,
            organizationId: organization.id,
          },
        });

        if (!project) {
          throw new BadRequestError('project not found.');
        }

        return reply.status(200).send({ project });
      }
    );
}
