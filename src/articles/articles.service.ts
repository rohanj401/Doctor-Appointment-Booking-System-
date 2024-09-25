// src/articles/articles.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article, ArticleDocument } from '../schemas/Articles.schema';
import { Doctor } from '../schemas/doctor.schema';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    console.log('doctorId is ', createArticleDto.doctorId);
    const doctorId = new Types.ObjectId(createArticleDto.doctorId);
    console.log('creating article for doctor Id ', doctorId);
    const doctor = await this.doctorModel
      .findById(createArticleDto.doctorId)
      .exec();
    console.log('doctor is ', doctor);

    if (!doctor) {
      throw new ForbiddenException('Only existing doctors can write articles');
    }
    const createdArticle = new this.articleModel({
      ...createArticleDto,
      doctor: doctor._id,
    });
    console.log('article created successfully');
    return createdArticle.save();
  }

  async findAll(query: any = {}): Promise<Article[]> {
    if (query.doctor) {
      query.doctor = new Types.ObjectId(query.doctor);
    }
    console.log(query);
    return this.articleModel
      .find(query)
      .populate('doctor')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleModel
      .findById(id)
      .populate('doctor')
      .exec();
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async update(
    id: string,
    updateArticleDto: Partial<CreateArticleDto>,
  ): Promise<Article> {
    const updatedArticle = await this.articleModel
      .findByIdAndUpdate(id, updateArticleDto, { new: true })
      .exec();
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
