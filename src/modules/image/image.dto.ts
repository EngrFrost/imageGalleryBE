import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto';

export class ImageFilterDto extends PaginationDto {
  @IsOptional()
  color: string;

  @IsOptional()
  search: string;

  @IsOptional()
  similarTo: string; // Image ID for similar image search
}
