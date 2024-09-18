// src/articles/dto/create-article.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  doctorId: string; 

  @IsNotEmpty()
  @IsString()
  category: string; 

  @IsNotEmpty()
  @IsString()
  subCategory: string;
}
