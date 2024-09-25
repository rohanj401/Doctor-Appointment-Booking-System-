// src/articles/articles.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthGuard } from 'src/auth/auth.gaurd';

@Controller('articles')
@UseGuards(AuthGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    console.log('creatin article');
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  async findAll(@Query('filter') filter: string) {
    const query = filter ? JSON.parse(filter) : {};
    return this.articlesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: Partial<CreateArticleDto>,
  ) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}
