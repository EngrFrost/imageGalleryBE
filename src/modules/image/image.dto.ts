import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto';

export class ImageFilterDto extends PaginationDto {
  @IsOptional()
  color: string;
}
