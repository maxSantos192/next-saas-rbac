import { api } from './api-client';

interface TransferOrganizationResquest {
  org: string;
  transferToUserId: string;
}

type TransferOrganizationResponse = void;

export async function transferOrganization({
  org,
  transferToUserId,
}: TransferOrganizationResquest): Promise<TransferOrganizationResponse> {
  await api.patch(`organization/${org}/owner`, {
    json: {
      transferToUserId,
    },
  });
}
