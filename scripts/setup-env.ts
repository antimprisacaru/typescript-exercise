import * as fs from 'fs';
import * as path from 'path';

const ENV_DIR = path.resolve(__dirname, '../libs/core/src/lib/config/env');

function copyEnvFiles() {
  const environments = ['development', 'production', 'test'];

  environments.forEach((env) => {
    const source = path.join(ENV_DIR, `${env}.env.example`);
    const destination = path.join(ENV_DIR, `${env}.env`);

    if (!fs.existsSync(destination)) {
      fs.copyFileSync(source, destination);
      console.log(`Created ${env}.env from example file`);
    } else {
      console.log(`${env}.env already exists, skipping`);
    }
  });
}

copyEnvFiles();
