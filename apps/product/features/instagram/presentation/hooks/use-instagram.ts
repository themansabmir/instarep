"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  disconnectInstagramAccount,
  fetchInstagramAccounts,
  instagramKeys,
} from "@/features/instagram/presentation/api";
import type { DisconnectInstagramInput } from "@/features/instagram/presentation/schemas";

export function useInstagramAccounts() {
  return useQuery({
    queryKey: instagramKeys.accounts,
    queryFn: fetchInstagramAccounts,
  });
}

export function useDisconnectInstagram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DisconnectInstagramInput) => disconnectInstagramAccount(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instagramKeys.all });
      toast.success("Instagram account disconnected.");
    },
    onError: () => {
      toast.error("Could not disconnect Instagram account.");
    },
  });
}
