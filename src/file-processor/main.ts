import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { FileProcessorModule } from './file-processor.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('FileProcessorMicroservice');

  const app = await NestFactory.createMicroservice(FileProcessorModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
      queue: 'file_processing_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();
  logger.log('File Processor Microservice is listening');
}
bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});
