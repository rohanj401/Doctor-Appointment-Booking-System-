import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ArticlesService } from './articles.service';
import { Article, ArticleDocument } from '../schemas/Articles.schema';
import { Doctor } from '../schemas/doctor.schema';
import { Model, Types } from 'mongoose';
import { CreateArticleDto } from './dto/create-article.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

// Mock Data
const mockDoctor = {
  _id: new Types.ObjectId(),
  name: 'Test Doctor',
};

const mockArticle = {
  _id: new Types.ObjectId(),
  title: 'Test Article',
  content: 'Test Content',
  doctor: mockDoctor._id,
  image: 'image_url',
  category: 'Healthy Hair',
  subCategory: 'Hair Growth',
  createdAt: new Date(),
};

// Mock Model
const mockArticleModel = {
  create: jest.fn().mockResolvedValue(mockArticle),
  findById: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(mockArticle),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  find: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
};

const mockDoctorModel = {
  findById: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(mockDoctor),
};

describe('ArticlesService', () => {
  let service: ArticlesService;
  let articleModel: Model<ArticleDocument>;
  let doctorModel: Model<Doctor>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getModelToken(Article.name),
          useValue: mockArticleModel,
        },
        {
          provide: getModelToken(Doctor.name),
          useValue: mockDoctorModel,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    articleModel = module.get<Model<ArticleDocument>>(
      getModelToken(Article.name),
    );
    doctorModel = module.get<Model<Doctor>>(getModelToken(Doctor.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an article if doctor exists', async () => {
      const createArticleDto: CreateArticleDto = {
        title: 'Test Article',
        content: 'Test Content',
        doctorId: mockDoctor._id.toHexString(),
        image: 'image_url',
        category: 'Healthy Hair',
        subCategory: 'Hair Growth',
      };

      // Ensure findById returns the correct mockDoctor object with exec
      mockDoctorModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDoctor),
      });

      const result = await service.create(createArticleDto);

      expect(doctorModel.findById).toHaveBeenCalledWith(
        createArticleDto.doctorId,
      );
      expect(mockArticleModel.create).toHaveBeenCalledWith({
        ...createArticleDto,
        doctor: mockDoctor._id,
      });
      expect(result).toEqual(mockArticle);
    });

    it('should throw ForbiddenException if doctor does not exist', async () => {
      const createArticleDto: CreateArticleDto = {
        title: 'Test Article',
        content: 'Test Content',
        doctorId: mockDoctor._id.toHexString(),
        image: 'image_url',
        category: 'Healthy Hair',
        subCategory: 'Hair Growth',
      };

      // Ensure findById returns null with exec
      mockDoctorModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.create(createArticleDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findOne', () => {
    it('should return an article if found', async () => {
      const result = await service.findOne(mockArticle._id.toHexString());
      expect(mockArticleModel.findById).toHaveBeenCalledWith(
        mockArticle._id.toHexString(),
      );
      expect(result).toEqual(mockArticle);
    });

    it('should throw NotFoundException if article is not found', async () => {
      mockArticleModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.findOne(mockArticle._id.toHexString()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an article if found', async () => {
      const updateArticleDto = { title: 'Updated Title' };

      mockArticleModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockArticle,
          title: 'Updated Title',
        }),
      });

      const result = await service.update(
        mockArticle._id.toHexString(),
        updateArticleDto,
      );
      expect(mockArticleModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockArticle._id.toHexString(),
        updateArticleDto,
        { new: true },
      );
      expect(result.title).toEqual('Updated Title');
    });

    it('should throw NotFoundException if article is not found', async () => {
      mockArticleModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update(mockArticle._id.toHexString(), { title: 'New Title' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an article if found', async () => {
      await service.remove(mockArticle._id.toHexString());
      expect(mockArticleModel.findByIdAndDelete).toHaveBeenCalledWith(
        mockArticle._id.toHexString(),
      );
    });

    it('should throw NotFoundException if article is not found', async () => {
      mockArticleModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.remove(mockArticle._id.toHexString()),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
