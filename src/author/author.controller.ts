import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { AuthorService } from './author.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { AuthorDto } from './dto/author.dto'

@Controller('authors')
export class AuthorController {
	constructor(private readonly authorService: AuthorService) {}
	@Get()
	async getAll() {
		return this.authorService.getAll()
	}

	@Get('/most-popular')
	async getMostPopular() {
		return this.authorService.getMostPopular()
	}

	@Get(':id')
	async byId(@Param('id') id: string) {
		return this.authorService.byId(+id)
	}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.authorService.bySlug(slug)
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.authorService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(@Param('id') id: string, @Body() dto: AuthorDto) {
		return this.authorService.update(+id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Put('src/:id')
	@HttpCode(200)
	// @Auth('admin')
	async updateSrc(@Param('id') id: string, @Body() dto: { src: string }) {
		return this.authorService.updateSrc(+id, dto.src)
	}

	@UsePipes(new ValidationPipe())
	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id') id: string) {
		return this.authorService.delete(+id)
	}
}
