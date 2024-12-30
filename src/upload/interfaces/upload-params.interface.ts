import { Readable } from 'stream';

export interface UploadFileParams {
  url: string;
  fileStream: Readable;
  fileName: string;
  mimeType: string;
  fileSize: number;
}
