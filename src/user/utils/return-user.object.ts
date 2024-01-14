import { Prisma } from '@prisma/client'

export const returnUserObject: Prisma.UserSelect = {
	id: true,
	email: true,
	name: true,
	isAdmin: true,
	avatarPath: true,
	phone: true,
	orders: {
		orderBy: {
			createdAt: 'desc'
		}
	}
}
