// src/articles/articles.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article, ArticleDocument } from 'src/schemas/Articles';
import { Doctor } from 'src/schemas/doctor.schema';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const doctor = await this.doctorModel.findById(createArticleDto.doctorId).exec();
    
    if (!doctor) {
      throw new ForbiddenException('Only existing doctors can write articles');
    }

    const createdArticle = new this.articleModel({
      ...createArticleDto,
      doctor: doctor._id,
    });

    return createdArticle.save();
  }

  async findAll(): Promise<Article[]> {
    return this.articleModel.find().populate('doctor').exec();
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleModel.findById(id).populate('doctor').exec();
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async update(id: string, updateArticleDto: Partial<CreateArticleDto>): Promise<Article> {
    const updatedArticle = await this.articleModel.findByIdAndUpdate(id, updateArticleDto, { new: true }).exec();
    if (!updatedArticle) {
      throw new NotFoundException('Article not found');
    }
    return updatedArticle;
  }

  async remove(id: string): Promise<void> {
    const result = await this.articleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Article not found');
    }
  }
}
