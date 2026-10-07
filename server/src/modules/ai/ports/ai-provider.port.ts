export const AI_PROVIDER = Symbol('AI_PROVIDER');

export interface AiGenerationRequest {
  instruction: string;
  context: Record<string, unknown>;
  task: 'LEAD_SUMMARY' | 'PROJECT_CONTENT_DRAFT';
}

export interface AiGenerationResult {
  content: string;
  metadata?: Record<string, unknown>;
}

export interface AiProviderPort {
  generate(request: AiGenerationRequest): Promise<AiGenerationResult>;
}
