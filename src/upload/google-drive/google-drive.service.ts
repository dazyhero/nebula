import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { drive_v3 } from 'googleapis';
import { UploadFileParams } from '@upload/interfaces/upload-params.interface';

@Injectable()
export class GoogleDriveService {
  private readonly logger = new Logger(GoogleDriveService.name, { timestamp: true });

  constructor(private readonly authService: AuthService) {}

  async uploadFile(
    params: UploadFileParams,
  ): Promise<drive_v3.Schema$File & { fileSize: number; name: string; url: string }> {
    const { fileStream, fileName, mimeType } = params;
    const drive = await this.authService.getDriveInstance();

    this.logger.log(`Starting upload for file: ${fileName}`);

    try {
      const requestBody: drive_v3.Schema$File = {
        name: fileName,
        mimeType: mimeType,
      };

      const media = {
        mimeType: mimeType,
        body: fileStream,
      };

      const response = await drive.files.create({
        requestBody,
        media: media,
        fields: 'id, name, mimeType, webViewLink, size',
      });

      await drive.permissions.create({
        fileId: response.data.id!,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      const updatedFile = await drive.files.get({
        fileId: response.data.id!,
        fields: 'id, name, mimeType, webViewLink, webContentLink',
      });

      this.logger.log(
        `Successfully uploaded and shared file ${fileName} with ID: ${response.data.id}`,
      );

      return {
        ...updatedFile.data,
        name: fileName,
        fileSize: params.fileSize,
        url: params.url,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error(`Failed to upload file ${fileName}: ${errorMessage}`);
      throw new Error(`Failed to upload file ${fileName}: ${errorMessage}`);
    }
  }
}
