import { Type } from 'class-transformer';
import { OmitType, PickType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsNotEmpty,
  Length,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class BookDto {
  id: number;
  @IsNotEmpty()
  @Length(4, 10)
  title: string;
  @IsNotEmpty()
  author: string;
  @IsInt()
  @Min(2020)
  @Max(2023)
  year: number;
}

export class CreatedBookDto extends OmitType(BookDto, ['id']) {}
export class UpdateBookDto extends PickType(BookDto, [
  'id',
  'title',
  'author',
  'year',
]) {}
export class FindBookDto extends PageRequestDto {
  @IsOptional()
  title: string;

  @IsOptional()
  author: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  from_year: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  to_year: number;
}
