import { roleSchema } from '@saas/auth';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { BadRequestError } from '../_errors/bad-request-error';
import { UnauthorizedError } from '../_errors/unauthorized-error';

export async function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Create a new invite',
          security: [{ bearerAuth: [] }],
          body: z.object({
            email: z.email(),
            role: roleSchema,
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              inviteId: z.uuid(),
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

        if (cannot('create', 'Invite')) {
          throw new UnauthorizedError(
            `you're not allowed to create a new invite.`
          );
        }

        const { email, role } = request.body;

        const [, domain] = email.split('@');

        if (
          organization.shouldAttachUsersByDomain &&
          organization.domain === domain
        ) {
          throw new BadRequestError(
            `users with "${domain}" domain will join your organization automatically on login.`
          );
        }

        const inviteWithSameEmail = await prisma.invite.findUnique({
          where: {
            email_organizationId: {
              email,
              organizationId: organization.id,
            },
          },
        });

        if (inviteWithSameEmail) {
          throw new BadRequestError(
            'another user with the same e-mail alredy exists.'
          );
        }

        const memberWithSameEmail = await prisma.member.findFirst({
          where: {
            organizationId: organization.id,
            user: {
              email,
            },
          },
        });

        if (memberWithSameEmail) {
          throw new BadRequestError(
            'a member with this e-mail alredy belongs to your organization.'
          );
        }

        const invite = await prisma.invite.create({
          data: {
            email,
            role,
            authorId: userId,
            organizationId: organization.id,
          },
        });

        return reply.status(201).send({ inviteId: invite.id });
      }
    );
}
