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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/guards/role.enum';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @Roles(Role.Doctor)
  async create(@Body() createArticleDto: CreateArticleDto) {
    console.log('creating a article');
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @Roles(Role.Doctor, Role.Patient)
  async findAll(@Query('filter') filter: string) {
    const query = filter ? JSON.parse(filter) : {};
    return this.articlesService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.Doctor, Role.Patient)
  async findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Doctor)
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: Partial<CreateArticleDto>,
  ) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @Roles(Role.Doctor)
  async remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}
