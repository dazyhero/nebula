import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleDriveService } from './google-drive.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AuthService, GoogleDriveService],
  exports: [AuthService, GoogleDriveService],
})
export class GoogleDriveModule {}
