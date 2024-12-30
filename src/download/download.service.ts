import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as path from 'path';
import { Readable } from 'stream';
import { FileSizeInfo } from './interfaces/file-size-info.interface';

@Injectable()
export class DownloadService {
  private readonly logger = new Logger(DownloadService.name, { timestamp: true });

  async getFileSize(url: string): Promise<FileSizeInfo> {
    const headResponse: AxiosResponse<Buffer> = await axios.head(url);
    const contentLength = parseInt((headResponse.headers['content-length'] || '0') as string, 10);
    const contentType = (headResponse.headers['content-type'] ||
      'application/octet-stream') as string;
    const fileName = `${Date.now()}-${path.basename(url)}`;

    return {
      sizeInMB: Number((contentLength / 1024 / 1024).toFixed(1)),
      contentType,
      fileName,
    };
  }

  async getFileStream(url: string): Promise<{
    stream: Readable;
    fileName: string;
    contentType: string;
    contentLength: number;
  }> {
    try {
      this.logger.log(`Downloading file from ${url}`);
      const headResponse: AxiosResponse<Buffer> = await axios.head(url);
      const contentLength = parseInt((headResponse.headers['content-length'] || '0') as string, 10);
      const contentType = (headResponse.headers['content-type'] ||
        'application/octet-stream') as string;
      const fileName = `${Date.now()}-${path.basename(url)}`;

      const response = await axios<Readable>({
        method: 'GET',
        url: url,
        responseType: 'stream',
        timeout: 30000,
      });

      return {
        stream: response.data,
        fileName,
        contentType,
        contentLength,
      };
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new HttpException('Failed to download file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
