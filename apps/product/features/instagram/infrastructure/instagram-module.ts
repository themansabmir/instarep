import {
  makeConnectInstagramAccount,
  makeDisconnectInstagramAccount,
  makeGetInstagramConnectUrl,
  makeListInstagramAccounts,
} from "@/features/instagram/application/instagram-use-cases";
import type { InstagramConnectionRepository } from "@/features/instagram/domain/ports";
import { createInstagramPackageRepository } from "@/features/instagram/infrastructure/instagram-package-repository";

/**
 * Composition root for the Instagram feature in the product app.
 */
let repository: InstagramConnectionRepository | undefined;

function getRepository(): InstagramConnectionRepository {
  repository ??= createInstagramPackageRepository();
  return repository;
}

export function getInstagramService() {
  const repo = getRepository();
  return {
    getConnectUrl: makeGetInstagramConnectUrl(repo),
    connectAccount: makeConnectInstagramAccount(repo),
    listAccounts: makeListInstagramAccounts(repo),
    disconnectAccount: makeDisconnectInstagramAccount(repo),
  };
}
