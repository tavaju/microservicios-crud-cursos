import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { StudentsClientService } from './students-client.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
    ConfigModule,
  ],
  providers: [StudentsClientService],
  exports: [StudentsClientService],
})
export class StudentsClientModule {}
