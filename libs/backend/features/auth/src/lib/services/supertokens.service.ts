import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import { SupertokensConfig } from '../config/supertokens.config';

@Injectable()
export class SupertokensService {
  constructor(@Inject() private readonly config: SupertokensConfig) {
    supertokens.init(this.config.getConfig());
  }
}
