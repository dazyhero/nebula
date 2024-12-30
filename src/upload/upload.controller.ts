import { Controller, Post, Body, Logger, Get, Param } from '@nestjs/common';
import { UploadService } from './upload.service';
import { BulkUploadDto } from './dto/bulk-upload.dto';

@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private readonly uploadService: UploadService) {}

  @Get('urls')
  async getUploadFileData(@Param('limit') limit = 10, @Param('offset') offset = 0) {
    this.logger.log(`Received request to get upload file data`);
    return this.uploadService.getUploadFileData(limit, offset);
  }

  @Post('urls')
  async uploadMultipleUrls(@Body() bulkUploadDto: BulkUploadDto) {
    const { urls } = bulkUploadDto;
    this.logger.log(`Received request to process ${urls.length} URLs`);
    return this.uploadService.uploadMultipleUrls(urls);
  }
}
