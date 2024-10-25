import { Injectable } from '@nestjs/common';
import { TypeInput } from 'supertokens-node/types';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import Dashboard from 'supertokens-node/recipe/dashboard';
import { EnvironmentConfigService } from './env.config';

@Injectable()
export class SupertokensConfig {
  constructor(private envConfig: EnvironmentConfigService) {}

  getConfig(): TypeInput {
    return {
      framework: 'express',
      supertokens: {
        connectionURI: this.envConfig.supertokensConnectionUri,
        apiKey: this.envConfig.supertokensApiKey,
      },
      appInfo: {
        appName: 'Chat App',
        apiDomain: this.envConfig.apiDomain,
        websiteDomain: this.envConfig.websiteDomain,
        apiBasePath: '/auth',
        websiteBasePath: '/auth',
      },
      recipeList: [
        EmailPassword.init({
          signUpFeature: {
            formFields: [
              { id: 'firstName', optional: false },
              { id: 'lastName', optional: false },
            ],
          },
        }),
        Session.init(),
        Dashboard.init(),
      ],
    };
  }
}
