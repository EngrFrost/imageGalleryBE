import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Max(500)
  @Min(1)
  limit = 12;

  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page = 1;

  @Transform(({ obj }) => (obj.page - 1) * obj.limit)
  offset: number;
}
