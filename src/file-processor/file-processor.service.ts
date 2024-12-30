import { Injectable, Logger } from '@nestjs/common';
import { GoogleDriveService } from '../upload/google-drive/google-drive.service';
import { DownloadService } from '../download/download.service';
import { FileProcessRequest } from './interfaces/file-process-request.interface';
import { ProcessingResult } from './interfaces/processing-result.interface';

@Injectable()
export class FileProcessorService {
  private readonly logger = new Logger(FileProcessorService.name);

  constructor(
    private readonly googleDriveService: GoogleDriveService,
    private readonly downloadService: DownloadService,
  ) {}

  async processFile(request: FileProcessRequest): Promise<ProcessingResult> {
    try {
      this.logger.log(`Processing file from URL: ${request.url}`);

      const { stream } = await this.downloadService.getFileStream(request.url);

      const uploadResult = await this.googleDriveService.uploadFile({
        url: request.url,
        fileStream: stream,
        fileName: request.fileName,
        mimeType: request.mimeType,
        fileSize: request.fileSize,
      });

      return {
        success: true,
        url: request.url,
        fileId: uploadResult.id!,
        webViewLink: uploadResult.webViewLink!,
        webContentLink: uploadResult.webContentLink!,
        fileSize: request.fileSize,
        name: request.fileName,
        mimeType: request.mimeType,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to process file: ${errorMessage}`);
      throw new Error(`Failed to process file: ${errorMessage}`);
    }
  }
}
