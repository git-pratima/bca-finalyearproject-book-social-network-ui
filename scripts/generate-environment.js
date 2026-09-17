const fs = require('fs');
const path = require('path');

const target = process.argv[2];
const isProduction = target === 'production';

if (!isProduction && target !== 'development') {
  throw new Error('Usage: node scripts/generate-environment.js <development|production>');
}

const googleClientId = process.env.GOOGLE_CLIENT_ID
  || '345492205775-tqsuvfopjpm3dldffpboipqjpebo7bqm.apps.googleusercontent.com';

if (isProduction && !googleClientId) {
  throw new Error('GOOGLE_CLIENT_ID must be set for a production build.');
}

const environmentsDirectory = path.join(__dirname, '..', 'src', 'environments');
fs.mkdirSync(environmentsDirectory, { recursive: true });

function writeEnvironment(filename, production, apiUrl) {
  const environment = `export const environment = {
  production: ${production},
  apiUrl: ${JSON.stringify(apiUrl)},
  googleClientId: ${JSON.stringify(googleClientId)}
};
`;
  fs.writeFileSync(path.join(environmentsDirectory, filename), environment, 'utf8');
}

// Angular validates the replacement source file even for production builds.
writeEnvironment('environment.ts', false, 'http://localhost:8088');

if (isProduction) {
  writeEnvironment('environment.prod.ts', true, 'https://bca-finalyearproject-book-social-network.onrender.com');
}
