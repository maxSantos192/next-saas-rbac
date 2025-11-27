import { FastifyInstance } from 'fastify';
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';

import { BadRequestError } from './routes/_errors/bad-request-error';
import { UnauthorizedError } from './routes/_errors/unauthorized-error';

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      errors: error.validation.map((issue) => ({
        path: issue.instancePath,
        message: issue.message,
      })),
      message: 'validation error.',
    });
  }

  if (error instanceof BadRequestError) {
    reply.status(400).send({
      message: error.message,
    });
    return;
  }

  if (error instanceof UnauthorizedError) {
    reply.status(401).send({
      message: error.message,
    });
    return;
  }

  console.error(error);

  reply.status(500).send({ message: 'internal server error.' });
};
