import 'fastify';

import { Member, Organization } from '@/generated/prisma/client';

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>;
    getUserMemberShip(
      slug: string
    ): Promise<{ membership: Member; organization: Organization }>;
  }
}
