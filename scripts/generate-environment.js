const fs = require('fs');
const path = require('path');

const target = process.argv[2];
const isProduction = target === 'production';

if (!isProduction && target !== 'development') {
  throw new Error('Usage: node scripts/generate-environment.js <development|production>');
}

const googleClientId = process.env.GOOGLE_CLIENT_ID || '';

if (isProduction && !googleClientId) {
  throw new Error('GOOGLE_CLIENT_ID must be set for a production build.');
}

const environment = `export const environment = {
  production: ${isProduction},
  apiUrl: ${JSON.stringify(isProduction ? '/api' : 'http://localhost:8088')},
  googleClientId: ${JSON.stringify(googleClientId)}
};
`;

const output = path.join(
  __dirname,
  '..',
  'src',
  'environments',
  isProduction ? 'environment.prod.ts' : 'environment.ts'
);

fs.writeFileSync(output, environment, 'utf8');
