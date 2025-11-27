import { roleSchema } from '@saas/auth';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { UnauthorizedError } from '../_errors/unauthorized-error';

export async function getInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Get all organization invites',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              invites: z.array(
                z.object({
                  id: z.uuid(),
                  role: roleSchema,
                  createdAt: z.date(),
                  email: z.email(),
                  author: z
                    .object({
                      id: z.uuid(),
                      name: z.string().nullable(),
                    })
                    .nullable(),
                })
              ),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params;
        const userId = await request.getCurrentUserId();
        const { organization, membership } =
          await request.getUserMemberShip(slug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('get', 'Invite')) {
          throw new UnauthorizedError(
            `you're not allowed to get organization invites.`
          );
        }

        const invites = await prisma.invite.findMany({
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        return { invites };
      }
    );
}
