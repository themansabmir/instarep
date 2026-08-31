import type {
  ConnectInstagramInput,
  ConnectInstagramResult,
  InstagramAccount,
} from "@/features/instagram/domain/instagram-account";

/**
 * Port for Instagram OAuth and account persistence. Implemented by an adapter
 * that delegates to `@repo/instagram`.
 */
export interface InstagramConnectionRepository {
  createConnectUrl(workspaceId: string, userId: string): Promise<string>;
  connectAccount(input: ConnectInstagramInput): Promise<ConnectInstagramResult>;
  listAccounts(workspaceId: string): Promise<InstagramAccount[]>;
  disconnectAccount(workspaceId: string, accountId: string): Promise<void>;
}
