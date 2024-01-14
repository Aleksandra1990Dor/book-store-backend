import {
	Controller,
	UsePipes,
	HttpCode,
	ValidationPipe,
	Get,
	Query,
	Post,
	Put,
	Delete,
	Param,
	Body
} from '@nestjs/common'
import { BookService } from './book.service'
import { GetAllBooksDto } from './dto/get-all-books.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { BookDto } from './dto/book.dto'

@Controller('books')
export class BookController {
	constructor(private readonly bookService: BookService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: GetAllBooksDto) {
		return this.bookService.getAll(queryDto)
	}

	@UsePipes(new ValidationPipe())
	@Get('popular-audio')
	async getPopularAudio() {
		return this.bookService.getMostPopularAudio()
	}

	@Get('similar/:id')
	async getSimilar(@Param('id') id: string) {
		return this.bookService.getSimilar(+id)
	}

	@Get('by-author/:id')
	async byAuthor(@Param('id') id: string) {
		return this.bookService.byAuthorId(+id)
	}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.bookService.bySlug(slug)
	}

	@Get('by-category/:categorySlug')
	async byCategorySlug(@Param('categorySlug') categorySlug: string) {
		return this.bookService.byCategory(categorySlug)
	}

	@Get(':id')
	@Auth('admin')
	async byId(@Param('id') id: string) {
		return this.bookService.byId(+id)
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.bookService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(@Param('id') id: string, @Body() dto: BookDto) {
		return this.bookService.update(+id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Put('src/:id')
	@HttpCode(200)
	// @Auth('admin')
	async updateSrc(@Param('id') id: string, @Body() dto: { src: string }) {
		return this.bookService.updateSrc(+id, dto.src)
	}

	@UsePipes(new ValidationPipe())
	@Put('set-audio/:id')
	@HttpCode(200)
	// @Auth('admin')
	async setAudio(@Param('id') id: string, @Body() dto: { src: string }) {
		return this.bookService.updateAudioUrl(+id, dto.src)
	}

	@UsePipes(new ValidationPipe())
	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id') id: string) {
		return this.bookService.delete(+id)
	}
}
