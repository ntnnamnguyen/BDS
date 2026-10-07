import { PrivateContactFormClient } from "@/features/leads/components/PrivateContactFormClient";
import {
  getMockLeadResult,
  isApiMockFallbackEnabled,
} from "@/lib/env.server";
import type { LeadMockUiConfig } from "@/lib/mocks/leads";

interface PrivateContactFormProps {
  projectId?: string;
  sourcePath?: string;
}

export function PrivateContactForm(props: PrivateContactFormProps) {
  const mockConfig: LeadMockUiConfig = {
    enabled: isApiMockFallbackEnabled(),
    defaultOutcome: getMockLeadResult(),
  };

  return <PrivateContactFormClient {...props} mockConfig={mockConfig} />;
}
