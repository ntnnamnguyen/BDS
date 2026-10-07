import { validateEnvironment } from './env.validation.js';

describe('validateEnvironment', () => {
  it('rejects the example admin key in production', () => {
    expect(() =>
      validateEnvironment({
        ADMIN_API_KEY: 'replace-with-shared-random-key-at-least-32-characters',
        DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
        NODE_ENV: 'production',
      }),
    ).toThrow('ADMIN_API_KEY must not use an example placeholder');
  });
});
