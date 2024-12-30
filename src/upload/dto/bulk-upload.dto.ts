import { IsArray, ArrayMinSize, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class BulkUploadDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one URL is required' })
  @IsUrl({}, { each: true, message: 'Each element must be a valid URL' })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  urls!: string[];
}
