import { Module } from '@nestjs/common';
import { FileProcessorController } from './file-processor.controller';
import { FileProcessorService } from './file-processor.service';
import { GoogleDriveModule } from '../upload/google-drive/google-drive.module';
import { DownloadModule } from '../download/download.module';
import { DatabaseModule } from '@src/db/db.module';

@Module({
  imports: [GoogleDriveModule, DownloadModule, DatabaseModule],
  controllers: [FileProcessorController],
  providers: [FileProcessorService],
})
export class FileProcessorModule {}
