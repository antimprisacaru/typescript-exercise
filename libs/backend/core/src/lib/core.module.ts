import { Module } from '@nestjs/common';
import { OgmaModule } from '@ogma/nestjs-module';
import { ValidationPipe } from './pipes/validation.pipe';

@Module({
  imports: [OgmaModule.forFeature(ValidationPipe.name)],
  providers: [],
  exports: [],
})
export class CoreModule {}
