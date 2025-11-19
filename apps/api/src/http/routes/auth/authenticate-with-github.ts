import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

import { BadRequestError } from '../_errors/bad-request-error';

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Authenticate with github account',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body;

      const githubOAuthURL = new URL(
        'https://github.com/login/oauth/access_token'
      );

      githubOAuthURL.searchParams.set('client_id', 'Ov23lieLNNIDlRfc7SkA');
      githubOAuthURL.searchParams.set(
        'client_secret',
        '6462c4008712a6e04a3e063639d2589bd9380cda'
      );
      githubOAuthURL.searchParams.set(
        'redirect_uri',
        'http://localhost:3000/api/auth/callback'
      );
      githubOAuthURL.searchParams.set('code', code);

      const githubAccessTokenResponse = await fetch(githubOAuthURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      });

      const githubAccessTokenData = await githubAccessTokenResponse.json();

      const { access_token: accessToken } = z
        .object({
          access_token: z.string(),
          token_type: z.literal('bearer'),
          scope: z.string(),
        })
        .parse(githubAccessTokenData);

      const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const githubUserData = await githubUserResponse.json();

      console.log(githubUserData);

      const {
        id: githubId,
        name,
        email,
        avatar_url: avatarUrl,
      } = z
        .object({
          id: z.number().int().transform(String),
          name: z.string().nullable(),
          email: z.email().nullable(),
          avatar_url: z.url(),
        })
        .parse(githubUserData);

      if (email === null) {
        throw new BadRequestError(
          'your github account must have an email to authenticate.'
        );
      }

      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
            avatarUrl,
          },
        });
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GITHUB',
            userId: user.id,
          },
        },
      });

      if (!account) {
        account = await prisma.account.create({
          data: {
            provider: 'GITHUB',
            providerAccountId: githubId,
            userId: user.id,
          },
        });
      }

      const token = await reply.jwtSign(
        {
          sub: user.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        }
      );

      return reply.status(201).send({ token });
    }
  );
}
