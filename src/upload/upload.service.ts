import { Injectable, Inject, Logger } from '@nestjs/common';
import { GoogleDriveService } from './google-drive/google-drive.service';
import { DownloadService } from '@download/download.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ProcessingResult } from '@file-processor/interfaces/processing-result.interface';
import { DownloadsRepository } from '@db/repository/downloads.repository';

const FILE_SIZE_THRESHOLD = 1000;

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name, { timestamp: true });

  constructor(
    private readonly googleDriveService: GoogleDriveService,
    private readonly downloadService: DownloadService,
    @Inject('FILE_PROCESSOR_SERVICE') private readonly fileProcessorClient: ClientProxy,
    private readonly downloadsRepository: DownloadsRepository,
  ) {}

  async getUploadFileData(limit: number, offset: number) {
    return this.downloadsRepository.findAll(limit, offset);
  }

  async uploadMultipleUrls(urls: string[]) {
    this.logger.log(`Processing ${urls.length} URLs`);

    const existingDownloads = await this.downloadsRepository.findByUrls(urls);
    const mappedExistingDownloads = existingDownloads.map(download => ({
      status: 'fulfilled' as const,
      value: download,
    }));

    const urlsToProcess = urls.filter(
      url => !existingDownloads.find(download => download.url === url),
    );

    const results = await Promise.allSettled(urlsToProcess.map(url => this.uploadFromUrl(url)));

    const fulfilledResults = results.filter(result => result.status === 'fulfilled');

    if (fulfilledResults.length > 0) {
      const downloadsData = fulfilledResults.map(result => {
        const value = result.value;

        return {
          url: value.url,
          size: value.fileSize,
          name: value.name,
          webContentLink: value.webContentLink ?? '',
          webViewLink: value.webViewLink ?? '',
          mimeType: value.mimeType ?? '',
        };
      });

      await this.downloadsRepository.bulkCreate(downloadsData);
    }
    return [...results, ...mappedExistingDownloads].map((result, index) => {
      if (result.status === 'fulfilled') {
        return {
          url: urls[index],
          result: result.value,
        };
      } else if (result.status === 'rejected') {
        return {
          url: urls[index],
          result: {
            error: result.reason instanceof Error ? result.reason.message : 'Unknown error',
          },
        };
      } else {
        return {
          url: urls[index],
          result: {
            error: 'Unknown error occurred',
          },
        };
      }
    });
  }

  async uploadFromUrl(url: string) {
    try {
      const fileSizeInfo = await this.downloadService.getFileSize(url);

      const fileName = url.split('/').pop() ?? 'downloaded-file';

      if (fileSizeInfo.sizeInMB > FILE_SIZE_THRESHOLD) {
        this.logger.log(`Large file detected (${fileSizeInfo.sizeInMB}MB), using microservice`);

        const result = await firstValueFrom<ProcessingResult>(
          this.fileProcessorClient.send('process_file', {
            url,
            fileName,
            mimeType: fileSizeInfo.contentType,
            fileSize: fileSizeInfo.sizeInMB,
          }),
        );

        if (!result.success) {
          throw new Error(result.error);
        }

        return result;
      }

      this.logger.log(`Small file detected (${fileSizeInfo.sizeInMB}MB), processing directly`);
      const { stream } = await this.downloadService.getFileStream(url);

      return this.googleDriveService.uploadFile({
        url,
        fileStream: stream,
        fileName,
        mimeType: fileSizeInfo.contentType || 'application/octet-stream',
        fileSize: fileSizeInfo.sizeInMB,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Upload failed: ${errorMessage}`);
      throw error;
    }
  }
}
