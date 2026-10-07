import { Module } from '@nestjs/common';

// Provider, persistence, worker and HTTP endpoints are intentionally deferred.
// Consumers will depend on AiProviderPort rather than a vendor SDK.
@Module({})
export class AiModule {}
