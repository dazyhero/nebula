export interface ProcessingResult {
  success: boolean;
  url: string;
  fileId?: string;
  webViewLink: string;
  webContentLink: string;
  error?: string;
  fileSize: number;
  name: string;
  mimeType: string;
}
