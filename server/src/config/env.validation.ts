export interface EnvironmentVariables {
  ADMIN_API_KEY: string;
  CORS_ORIGINS: string;
  DATABASE_URL: string;
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
}

const DEFAULT_CORS_ORIGINS = 'http://localhost:3000';
const DEFAULT_PORT = 3001;

function isPlaceholderSecret(value: string): boolean {
  return /^(?:replace|change)(?:[-_\s]|$)/i.test(value);
}

function requiredString(
  config: Record<string, unknown>,
  key: keyof EnvironmentVariables,
): string {
  const value = config[key];

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${key} is required`);
  }

  return value.trim();
}

function optionalString(
  config: Record<string, unknown>,
  key: keyof EnvironmentVariables,
  fallback: string,
): string {
  const value = config[key];

  if (value === undefined) return fallback;
  if (typeof value !== 'string') {
    throw new Error(`${key} must be a string`);
  }

  return value.trim();
}

export function validateEnvironment(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const databaseUrl = requiredString(config, 'DATABASE_URL');
  const adminApiKey = requiredString(config, 'ADMIN_API_KEY');
  const port = Number(config.PORT ?? DEFAULT_PORT);
  const nodeEnv = optionalString(config, 'NODE_ENV', 'development');

  if (!/^postgres(?:ql)?:\/\//.test(databaseUrl)) {
    throw new Error('DATABASE_URL must be a PostgreSQL connection URL');
  }

  if (adminApiKey.length < 32) {
    throw new Error('ADMIN_API_KEY must contain at least 32 characters');
  }

  if (nodeEnv === 'production' && isPlaceholderSecret(adminApiKey)) {
    throw new Error('ADMIN_API_KEY must not use an example placeholder');
  }

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  if (!['development', 'test', 'production'].includes(nodeEnv)) {
    throw new Error('NODE_ENV must be development, test, or production');
  }

  return {
    ADMIN_API_KEY: adminApiKey,
    CORS_ORIGINS: optionalString(config, 'CORS_ORIGINS', DEFAULT_CORS_ORIGINS),
    DATABASE_URL: databaseUrl,
    NODE_ENV: nodeEnv as EnvironmentVariables['NODE_ENV'],
    PORT: port,
  };
}
