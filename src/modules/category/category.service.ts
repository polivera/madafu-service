import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryStatus } from './category.types';
import { CategoryRequestCreateDto } from './dtos/category.request.create.dto';

@Injectable()
export class CategoryService {
  @InjectRepository(Category)
  private readonly repository: Repository<Category>;

  async getCategories(): Promise<Category[]> {
    return this.repository.find();
  }

  async createCategory(
    createCategory: CategoryRequestCreateDto,
  ): Promise<Category> {
    const categoryModel = new Category();
    categoryModel.name = createCategory.name;
    categoryModel.color = createCategory.color;
    categoryModel.status = CategoryStatus.ACTIVE;

    return this.repository.save(categoryModel);
  }

  async getCategoryByNameOrColor(
    name: string,
    color: string,
  ): Promise<Category[]> {
    return this.repository
      .createQueryBuilder()
      .where('name = :name', { name })
      .orWhere('color = :color', { color })
      .getMany();
  }

  async getCategoryById(id: number): Promise<Category> {
    return this.repository.findOneBy({ id });
  }
}
