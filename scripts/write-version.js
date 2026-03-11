const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
const publicDir = path.resolve(__dirname, '..', 'public');
const outputPath = path.resolve(publicDir, 'version.json');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const buildVersion = {
  appName: packageJson.name,
  appVersion: packageJson.version,
  buildId:
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    process.env.SOURCE_VERSION ||
    `local-${Date.now()}`,
  deployedAt: new Date().toISOString()
};

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(outputPath, `${JSON.stringify(buildVersion, null, 2)}\n`, 'utf8');
console.log(`Wrote build version file: ${outputPath}`);
