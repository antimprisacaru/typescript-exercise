import * as path from 'node:path';
import * as fs from 'node:fs';

const ENV_PATH = 'libs/backend/core/src/lib/config/env';
const ENV_DIR = path.join(process.cwd(), ENV_PATH);
const isDocker = fs.existsSync('/.dockerenv') || process.env.RUNNING_IN_DOCKER === 'true';

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyEnvFiles() {
  const environments = ['development', 'production', 'test'];
  console.log(`Running in ${isDocker ? 'Docker' : 'local'} environment`);
  console.log(`Environment directory: ${ENV_DIR}`);

  ensureDirectoryExists(ENV_DIR);

  environments.forEach((env) => {
    const source = path.join(ENV_DIR, `${env}.env.example`);
    const destination = path.join(ENV_DIR, `${env}.env`);

    try {
      if (!fs.existsSync(source)) {
        console.log(`Warning: ${env}.env.example not found at ${source}`);
        return;
      }

      if (!fs.existsSync(destination)) {
        fs.copyFileSync(source, destination);
        console.log(`Created ${env}.env from example file`);
      } else {
        console.log(`${env}.env already exists, skipping`);
      }
    } catch (error) {
      console.error(`Error processing ${env}.env:`, error);
      if (!isDocker) {
        throw error;
      }
    }
  });
}

copyEnvFiles();
