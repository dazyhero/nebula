import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleAsyncProvider } from './drizzle.provider';
import { DownloadsRepository } from './repository/downloads.repository';

@Module({
  imports: [ConfigModule],
  providers: [DrizzleAsyncProvider, DownloadsRepository],
  exports: [DownloadsRepository],
})
export class DatabaseModule {}
