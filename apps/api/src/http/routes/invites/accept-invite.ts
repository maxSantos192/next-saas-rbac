import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';

import { BadRequestError } from '../_errors/bad-request-error';
import { UnauthorizedError } from '../_errors/unauthorized-error';

export async function acceptInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/invites/:inviteId/accept',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Accept an invite',
          security: [{ bearerAuth: [] }],
          params: z.object({
            inviteId: z.uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { inviteId } = request.params;
        const userId = await request.getCurrentUserId();

        const invite = await prisma.invite.findUnique({
          where: {
            id: inviteId,
          },
        });

        if (!invite) {
          throw new BadRequestError('invite not found or expired.');
        }

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        if (!user) {
          throw new BadRequestError('user not found.');
        }

        if (invite.email !== user.email) {
          throw new UnauthorizedError('this invites belongs to another user.');
        }

        await prisma.$transaction([
          prisma.member.create({
            data: {
              role: invite.role,
              organizationId: invite.organizationId,
              userId,
            },
          }),

          prisma.invite.delete({
            where: {
              id: invite.id,
            },
          }),
        ]);

        return reply.status(204).send();
      }
    );
}
