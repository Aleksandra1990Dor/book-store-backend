import {
	Controller,
	Get,
	Put,
	Post,
	Param,
	HttpCode,
	ValidationPipe,
	UsePipes,
	Body,
	Delete
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { CategoryDto } from './dto/category.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	async getAll() {
		return this.categoryService.getAll()
	}

	@Get(':id')
	async byId(@Param('id') id: string) {
		return this.categoryService.byId(+id)
	}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.categoryService.bySlug(slug)
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.categoryService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(@Param('id') id: string, @Body() dto: CategoryDto) {
		return this.categoryService.update(+id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id') id: string) {
		return this.categoryService.delete(+id)
	}
}
