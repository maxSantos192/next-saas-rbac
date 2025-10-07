import z from 'zod';

import { billingSubject } from './subjects/billing';
import { inviteSubject } from './subjects/invite';
import { organizationSubject } from './subjects/organization';
import { projectSubject } from './subjects/project';
import { userSubject } from './subjects/user';

export const appAbilitiesSchema = z.union([
  billingSubject,
  inviteSubject,
  organizationSubject,
  projectSubject,
  userSubject,

  z.tuple([z.literal('manage'), z.literal('all')]),
]);
