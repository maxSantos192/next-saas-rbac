import { Role } from '@saas/auth';

import { api } from './api-client';

interface GetInvitesResponse {
  invites: {
    id: string;
    role: Role;
    createdAt: string;
    email: string;
    author: {
      id: string;
      name: string | null;
    } | null;
  }[];
}

export async function getInvites(org: string) {
  const result = await api
    .get(`organizations/${org}/invites`)
    .json<GetInvitesResponse>();

  return result;
}
