import type { InstagramConnectionRepository } from "@/features/instagram/domain/ports";
import type {
  ConnectInstagramInput,
  ConnectInstagramResult,
  InstagramAccount,
} from "@/features/instagram/domain/instagram-account";

export function makeGetInstagramConnectUrl(repository: InstagramConnectionRepository) {
  return async function getInstagramConnectUrl(
    workspaceId: string,
    userId: string,
  ): Promise<string> {
    return repository.createConnectUrl(workspaceId, userId);
  };
}

export function makeConnectInstagramAccount(repository: InstagramConnectionRepository) {
  return async function connectInstagramAccount(
    input: ConnectInstagramInput,
  ): Promise<ConnectInstagramResult> {
    return repository.connectAccount(input);
  };
}

export function makeListInstagramAccounts(repository: InstagramConnectionRepository) {
  return async function listInstagramAccounts(workspaceId: string): Promise<InstagramAccount[]> {
    return repository.listAccounts(workspaceId);
  };
}

export function makeDisconnectInstagramAccount(repository: InstagramConnectionRepository) {
  return async function disconnectInstagramAccount(
    workspaceId: string,
    accountId: string,
  ): Promise<void> {
    await repository.disconnectAccount(workspaceId, accountId);
  };
}
