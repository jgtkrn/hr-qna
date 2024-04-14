import { Module } from '@nestjs/common';

import { TextGenService } from './text-gen.service';

@Module({
  providers: [TextGenService],
  exports: [TextGenService],
})
export class TextGenModule {}
