import { returnCategoryObject } from './utils/return-category.object'
import { PrismaService } from './../prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CategoryDto } from './dto/category.dto'

@Injectable()
export class CategoryService {
	constructor(private readonly prisma: PrismaService) {}

	async getAll() {
		return this.prisma.category.findMany({
			where: {
				books: { some: {} }
			},
			select: { ...returnCategoryObject }
		})
	}

	async byId(categoryId: number) {
		const category = await this.prisma.category.findUnique({
			where: {
				id: categoryId
			},
			select: {
				...returnCategoryObject
			}
		})

		if (!category) throw new NotFoundException('Category not found')

		return category
	}

	async bySlug(slug: string) {
		const category = await this.prisma.category.findUnique({
			where: {
				slug: slug
			},
			select: {
				...returnCategoryObject
			}
		})

		if (!category) throw new NotFoundException('Category not found')

		return category
	}

	async create() {
		const category = await this.prisma.category.create({
			data: {
				name: '',
				slug: ''
			}
		})

		return category.id
	}

	async update(id: number, dto: CategoryDto) {
		await this.byId(id)

		const updatedCategory = await this.prisma.category.update({
			where: { id: id },
			data: {
				name: dto.name,
				slug: dto.slug
			}
		})

		return updatedCategory
	}

	async delete(id: number) {
		await this.byId(id)

		await this.prisma.category.delete({
			where: { id: id }
		})

		return { message: 'Category successfully deleted' }
	}
}
