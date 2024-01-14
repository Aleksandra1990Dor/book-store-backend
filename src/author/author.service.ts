import { returnAuthorObjects } from 'src/author/utils/return-author.object'
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { AuthorDto } from './dto/author.dto'

@Injectable()
export class AuthorService {
	constructor(private readonly prisma: PrismaService) {}

	async getAll() {
		return this.prisma.author.findMany({
			select: { ...returnAuthorObjects }
		})
	}

	async getMostPopular() {
		return this.prisma.author.findMany({
			orderBy: {
				books: {
					_count: 'desc'
				}
			},
			take: 1,
			select: { ...returnAuthorObjects }
		})
	}

	async byId(authorId: number) {
		const author = await this.prisma.author.findUnique({
			where: {
				id: authorId
			},
			select: {
				...returnAuthorObjects
			}
		})

		if (!author) throw new NotFoundException('Author not found')

		return author
	}

	async bySlug(slug: string) {
		const author = await this.prisma.author.findUnique({
			where: {
				slug: slug
			},
			select: {
				...returnAuthorObjects
			}
		})

		if (!author) throw new NotFoundException('Author not found')

		return author
	}

	async create() {
		const author = await this.prisma.author.create({
			data: {
				fullName: '',
				slug: '',
				avatarPath: ''
			}
		})

		return author.id
	}

	async update(id: number, dto: AuthorDto) {
		await this.byId(id)

		const updatedAuthor = await this.prisma.author.update({
			where: { id: id },
			data: {
				fullName: dto.fullName,
				slug: dto.slug,
				avatarPath: dto.avatarPath
			}
		})

		return updatedAuthor
	}

	async updateSrc(id: number, src: string) {
		const updatedBook = await this.prisma.author.update({
			where: { id },
			data: {
				avatarPath: src
			}
		})

		return updatedBook
	}

	async delete(id: number) {
		await this.byId(id)

		await this.prisma.author.delete({
			where: { id: id }
		})

		return { message: 'Author successfully deleted' }
	}
}
