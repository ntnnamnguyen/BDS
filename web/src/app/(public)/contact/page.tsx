import { ContactPageClient } from "@/features/leads/components/ContactPageClient";
import {
  getMockLeadResult,
  isApiMockFallbackEnabled,
} from "@/lib/env.server";
import type { LeadMockUiConfig } from "@/lib/mocks/leads";

export default function ContactPage() {
  const mockConfig: LeadMockUiConfig = {
    enabled: isApiMockFallbackEnabled(),
    defaultOutcome: getMockLeadResult(),
  };

  return <ContactPageClient mockConfig={mockConfig} />;
}
