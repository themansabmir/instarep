"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { campaignKeys, createCampaign, fetchCampaigns } from "@/features/campaigns/presentation/api";
import type { CreateCampaignInput } from "@/features/campaigns/presentation/schemas";

export function useCampaigns() {
  return useQuery({
    queryKey: campaignKeys.all,
    queryFn: fetchCampaigns,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCampaignInput) => createCampaign(input),
    onSuccess: (campaign) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
      toast.success(`Campaign "${campaign.name}" created`);
    },
    onError: () => {
      toast.error("Could not create the campaign. Please try again.");
    },
  });
}
