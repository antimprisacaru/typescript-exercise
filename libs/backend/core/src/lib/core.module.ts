import { Module } from '@nestjs/common';
import { OgmaModule } from '@ogma/nestjs-module';
import { ValidationPipe } from './pipes/validation.pipe';
import { UserDecoderService } from './services/user-decoder.service';
import { DataAccessModule } from '@typescript-exercise/backend/data-access/data-access.module';

@Module({
  imports: [DataAccessModule, OgmaModule.forFeature(ValidationPipe.name)],
  providers: [UserDecoderService],
  exports: [UserDecoderService],
})
export class CoreModule {}
