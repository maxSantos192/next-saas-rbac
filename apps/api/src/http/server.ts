import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { env } from '@saas/env';
import fastify from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { errorHandler } from './error-handler';
import { authRoutes } from './routes/auth';
import { billingRoutes } from './routes/billing';
import { invitesRoutes } from './routes/invites';
import { membersRoutes } from './routes/members';
import { orgsRoutes } from './routes/orgs';
import { projectsRoutes } from './routes/projects';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next-saas-rbac API',
      description: 'Fullstack SaaS RBAC app',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(fastifyCors);

app.register(authRoutes);
app.register(billingRoutes);
app.register(invitesRoutes);
app.register(membersRoutes);
app.register(projectsRoutes);
app.register(orgsRoutes);

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log('HTTP server running');
});
