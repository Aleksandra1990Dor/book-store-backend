import { Prisma } from '@prisma/client'

export const returnCategoryObject: Prisma.CategorySelect = {
	id: true,
	name: true,
	slug: true,
	_count: {
		select: {
			books: true
		}
	},
	books: {
		take: 1,
		select: {
			images: true
		}
	}
}
