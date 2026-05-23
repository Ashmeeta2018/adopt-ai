import pino from 'pino';

import { env, isProd } from './env';

/**
 * Server logger. Configured to redact common secret/PII keys.
 * Never log a full request body — log specific fields only.
 */
export const logger = pino({
  level: isProd ? 'info' : 'debug',
  base: { service: 'adopt-ai-web', env: env.NODE_ENV },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      '*.password',
      '*.token',
      '*.access_token',
      '*.refresh_token',
      '*.id_token',
      '*.email',
      '*.phone',
    ],
    censor: '[REDACTED]',
  },
});
