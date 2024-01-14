import { Prisma } from '@prisma/client'
import { returnCategoryObject } from 'src/category/utils/return-category.object'

export const returnBookObject: Prisma.BookSelect = {
	images: true,
	id: true,
	name: true,
	description: true,
	price: true,
	createdAt: true,
	slug: true,
	author: true,
	isAudioAvailable: true,
	audioUrl: true
}

export const bookReturnObjectFullest: Prisma.BookSelect = {
	...returnBookObject,
	category: {
		select: returnCategoryObject
	}
}
