import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FileProcessorService } from './file-processor.service';
import { FileProcessRequest } from './interfaces/file-process-request.interface';

@Controller()
export class FileProcessorController {
  private readonly logger = new Logger(FileProcessorController.name);

  constructor(private readonly fileProcessorService: FileProcessorService) {}

  @MessagePattern('process_file')
  async processFile(@Payload() request: FileProcessRequest) {
    this.logger.log(`Received file processing request for URL: ${request?.url}`);
    return this.fileProcessorService.processFile(request);
  }
}
