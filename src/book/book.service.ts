import { CategoryService } from '../category/category.service'
import {
	bookReturnObjectFullest,
	returnBookObject
} from './utils/return-book.object'
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { BookDto } from './dto/book.dto'
import { EnumBooksSort, GetAllBooksDto } from './dto/get-all-books.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class BookService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly categoryService: CategoryService
	) {}

	async getAll(dto: GetAllBooksDto = {}) {
		let where: Prisma.BookWhereInput

		if (dto.sort && dto.searchTerm) {
			where = this.getSort(dto.sort, dto.searchTerm)
		}

		const isOnlyAudio: Prisma.BookWhereInput =
			dto.sort === EnumBooksSort.AUDIO ? { isAudioAvailable: true } : {}

		const books = await this.prisma.book.findMany({
			where: { ...where, ...isOnlyAudio },
			orderBy: { createdAt: 'desc' },
			select: {
				...bookReturnObjectFullest
			}
		})

		return books
	}

	async getMostPopularAudio() {
		return this.prisma.book.findMany({
			where: {
				isAudioAvailable: true
			},
			take: 1,
			select: { ...bookReturnObjectFullest }
		})
	}

	async byId(bookId: number) {
		const book = await this.prisma.book.findUnique({
			where: {
				id: bookId
			},
			select: {
				...bookReturnObjectFullest
			}
		})

		if (!book) throw new NotFoundException('Book not found')

		return book
	}

	async byAuthorId(authorId: number) {
		const books = await this.prisma.book.findMany({
			where: {
				authorId: authorId
			},
			select: {
				...bookReturnObjectFullest
			}
		})

		if (!books) throw new NotFoundException('Books not found')

		return books
	}

	async bySlug(slug: string) {
		const book = await this.prisma.book.findUnique({
			where: {
				slug
			},
			select: {
				...bookReturnObjectFullest
			}
		})

		if (!book) throw new NotFoundException('Book not found')

		return book
	}

	async byCategory(categorySlug: string) {
		const books = await this.prisma.book.findMany({
			where: {
				category: {
					slug: categorySlug
				}
			},
			select: bookReturnObjectFullest
		})

		if (!books) throw new NotFoundException('Books not found')

		return books
	}

	async getSimilar(id: number) {
		const currentBook = await this.byId(id)

		const books = await this.prisma.book.findMany({
			where: {
				category: {
					name: currentBook.category.name
				},
				NOT: {
					id: currentBook.id
				}
			},
			select: returnBookObject
		})

		return books
	}

	async create() {
		const book = await this.prisma.book.create({
			data: {
				name: '',
				slug: '',
				price: 0,
				description: ''
			}
		})

		return book.id
	}

	async update(id: number, dto: BookDto) {
		await this.byId(id)
		await this.categoryService.byId(dto.categoryId)

		const updatedBook = await this.prisma.book.update({
			where: { id },
			data: {
				name: dto.name,
				description: dto.description,
				images: dto.images,
				price: dto.price,
				slug: dto.slug,
				audioUrl: dto.audioUrl,
				isAudioAvailable: dto.isAudioAvailable,
				category: { connect: { id: dto.categoryId } },
				author: { connect: { id: dto.authorId } }
			}
		})

		return updatedBook
	}

	async updateSrc(id: number, src: string) {
		const updatedBook = await this.prisma.book.update({
			where: { id },
			data: {
				images: [src]
			}
		})

		return updatedBook
	}

	async updateAudioUrl(id: number, src: string) {
		const updatedBook = await this.prisma.book.update({
			where: { id },
			data: {
				audioUrl: src,
				isAudioAvailable: true
			}
		})

		return updatedBook
	}

	async delete(id: number) {
		await this.byId(id)

		await this.prisma.book.delete({
			where: { id }
		})

		return { message: 'Book successfully deleted' }
	}

	private getSort(
		sort: EnumBooksSort,
		searchTerm: string
	): Prisma.BookWhereInput {
		if (sort === EnumBooksSort.AUDIO) {
			return {
				OR: [
					{
						isAudioAvailable: true,
						name: { contains: searchTerm, mode: 'insensitive' }
					}
				]
			}
		} else if (sort === EnumBooksSort.AUTHORS) {
			return {
				OR: [
					{
						author: {
							fullName: { contains: searchTerm, mode: 'insensitive' }
						}
					}
				]
			}
		}
		return {
			OR: [
				{
					name: { contains: searchTerm, mode: 'insensitive' }
				}
			]
		}
	}
}
