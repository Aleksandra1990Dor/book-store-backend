import { bookReturnObjectFullest } from 'src/book/utils/return-book.object'
import { Prisma } from '@prisma/client'

export const returnAuthorObjects: Prisma.AuthorSelect = {
	avatarPath: true,
	books: { select: { ...bookReturnObjectFullest } },
	fullName: true,
	id: true,
	slug: true,
	_count: {
		select: {
			books: true
		}
	}
}
