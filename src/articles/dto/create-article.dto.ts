// src/articles/dto/create-article.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  doctorId: string; // The ID of the doctor writing the article

  @IsNotEmpty()
  @IsString()
  category: string; // The article category (e.g., "Healthy Hair")

  @IsNotEmpty()
  @IsString()
  subCategory: string;
}
