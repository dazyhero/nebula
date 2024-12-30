import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { GoogleDriveModule } from './google-drive/google-drive.module';
import { DownloadModule } from '@download/download.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UploadController } from './upload.controller';
import { DatabaseModule } from '@db/db.module';

@Module({
  imports: [
    DatabaseModule,
    GoogleDriveModule,
    DownloadModule,
    ClientsModule.register([
      {
        name: 'FILE_PROCESSOR_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: 'file_processing_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
