import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import { ApiConfigService } from './services/api-config.service';
import { MailService } from './services/mail.service';

const providers = [ApiConfigService, MailService];

@Global()
@Module({
  providers,
  imports: [HttpModule],
  exports: [...providers, HttpModule],
})
export class SharedModule {}
