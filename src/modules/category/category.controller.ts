import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ValidationErrorResponse, ErrorCodes } from 'src/utils';
import { JwtAccessGuard } from '../auth/guards/jwt.access.guard';
import { JwtAdminGuard } from '../auth/guards/jwt.admin.guard';
import { CategoryService } from './category.service';
import { CategoryRequestCreateDto } from './dtos/category.request.create.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAdminGuard)
  @Post('create')
  async createCategory(@Body() createCategory: CategoryRequestCreateDto) {
    const existingCategories =
      await this.categoryService.getCategoryByNameOrColor(
        createCategory.name,
        createCategory.color,
      );

    if (existingCategories.length) {
      const errorResponse = ValidationErrorResponse.builder();
      if (existingCategories.find((cat) => cat.name == createCategory.name)) {
        errorResponse.addErrorMessage(
          `name: ${ErrorCodes.DUPLICATE_VALUE}`,
        );
      }
      if (existingCategories.find((cat) => cat.color == createCategory.color)) {
        errorResponse.addErrorMessage(
          `color: ${ErrorCodes.DUPLICATE_VALUE}`,
        );
      }
      return errorResponse.badRequestResponse();
    }

    try {
      return await this.categoryService.createCategory(createCategory);
    } catch (err) {
      return ValidationErrorResponse.builder()
        .addErrorMessage('Unexpected databse error')
        .addErrorMessage(`stacktrace: ${err}`)
        .internalServerError();
    }
  }

  @UseGuards(JwtAccessGuard)
  @Get('/list')
  async getAllCategories() {
    return this.categoryService.getCategories();
  }
}
