import {
  connectInstagramAccount as connectAccount,
  createOAuthState,
  disconnectInstagramAccount as disconnectAccount,
  listInstagramAccounts as listAccounts,
} from "@repo/instagram";

import type { InstagramConnectionRepository } from "@/features/instagram/domain/ports";

export function createInstagramPackageRepository(): InstagramConnectionRepository {
  return {
    async createConnectUrl(workspaceId: string, userId: string): Promise<string> {
      const { authUrl } = await createOAuthState({ workspaceId, userId });
      return authUrl;
    },

    connectAccount: connectAccount,

    async listAccounts(workspaceId: string) {
      return listAccounts(workspaceId);
    },

    async disconnectAccount(workspaceId: string, accountId: string) {
      await disconnectAccount({ workspaceId, accountId });
    },
  };
}
