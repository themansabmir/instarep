"use client";

import { Avatar } from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

import type { InstagramAccountView } from "@/features/instagram/domain/instagram-account";
import { useDisconnectInstagram } from "@/features/instagram/presentation/hooks/use-instagram";

interface InstagramConnectionCardProps {
  account: InstagramAccountView;
  onDisconnected?: () => void;
}

function statusVariant(status: string): "default" | "secondary" | "destructive" {
  if (status === "CONNECTED") return "default";
  if (status === "DISCONNECTED" || status === "ERROR") return "destructive";
  return "secondary";
}

export function InstagramConnectionCard({ account, onDisconnected }: InstagramConnectionCardProps) {
  const disconnect = useDisconnectInstagram();

  async function handleDisconnect() {
    try {
      await disconnect.mutateAsync({ accountId: account.id });
      onDisconnected?.();
    } catch {
      // Toast handled by mutation onError
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected account</CardTitle>
        <CardDescription>
          Your Instagram Professional account linked to this workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar
            src={account.profilePictureUrl}
            alt={account.displayName ?? account.username ?? "Instagram"}
            fallback={account.username ?? "IG"}
            className="size-14"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">
                {account.displayName ?? account.username ?? "Instagram account"}
              </p>
              <Badge variant={statusVariant(account.status)}>{account.status}</Badge>
            </div>
            {account.username && (
              <p className="text-muted-foreground text-sm">@{account.username}</p>
            )}
            {account.followersCount != null && (
              <p className="text-muted-foreground text-sm">
                {account.followersCount.toLocaleString()} followers
              </p>
            )}
            {account.connectedAt && (
              <p className="text-muted-foreground text-xs">
                Connected {new Date(account.connectedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        {account.status !== "DISCONNECTED" && (
          <Button variant="outline" onClick={handleDisconnect} disabled={disconnect.isPending}>
            Disconnect
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function ConnectInstagramButton({ label = "Connect Instagram" }: { label?: string }) {
  function handleConnect() {
    window.location.href = "/api/instagram/connect";
  }

  return (
    <Button
      onClick={handleConnect}
      className="bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white hover:opacity-90"
    >
      {label}
    </Button>
  );
}

export function InstagramConnectionsView({ accounts }: { accounts: InstagramAccountView[] }) {
  const connected = accounts.filter((account) => account.status !== "DISCONNECTED");

  if (connected.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Instagram</CardTitle>
          <CardDescription>
            Link your Instagram Professional account to receive messages and automate conversations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConnectInstagramButton />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {connected.map((account) => (
        <InstagramConnectionCard key={account.id} account={account} />
      ))}
      <ConnectInstagramButton label="Reconnect or switch account" />
    </div>
  );
}
