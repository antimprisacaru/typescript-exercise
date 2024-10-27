import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import { randFirstName, randLastName } from '@ngneat/falso';
import { BaseSeed } from '../common/seed/base.seed';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

@Injectable()
export class UserSeed implements BaseSeed {
  constructor(private readonly prisma: PrismaService, @OgmaLogger(UserSeed) private readonly logger: OgmaService) {}

  async seed(): Promise<void> {
    const numberOfUsers = 20;

    for (let i = 1; i <= numberOfUsers; i++) {
      const userData = {
        email: `testuser${i}@gmail.com`,
        password: 'Password1!',
        firstName: randFirstName(),
        lastName: randLastName(),
      };

      try {
        this.logger.info(`Creating user with email ${userData.email} in the supertokens DB...`);
        const signUpResponse = await EmailPassword.signUp('public', userData.email, userData.password);

        if (signUpResponse.status === 'EMAIL_ALREADY_EXISTS_ERROR') {
          this.logger.warn(`User ${userData.email} already exists, skipping...`);
          continue;
        }

        if (signUpResponse.status === 'OK') {
          try {
            this.logger.info(`Creating user with email ${userData.email} in the repository...`);
            await this.prisma.user.create({
              data: {
                supertokensId: signUpResponse.user.id,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
              },
            });

            this.logger.info(`User ${userData.email} successfully created.`);
          } catch (error) {
            this.logger.error(`Failed to create user in database`, JSON.stringify(error));
          }
        }
      } catch (error) {
        this.logger.error(`Failed to create user in SuperTokens`, JSON.stringify(error));
      }
    }
  }

  async clean(): Promise<void> {
    this.logger.info('Cleaning up users...');
    await this.prisma.user.deleteMany();
    // TODO: SuperTokens cleanup
  }
}
