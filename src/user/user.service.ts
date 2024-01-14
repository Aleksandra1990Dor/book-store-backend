import { bookReturnObjectFullest } from './../book/utils/return-book.object'
import { returnUserObject } from './utils/return-user.object'
import {
	Injectable,
	NotFoundException,
	BadRequestException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserDto } from './dto/user.dto'
import { hash } from 'argon2'
import { Prisma } from '@prisma/client'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async byId(userId: number, selectObject: Prisma.UserSelect = {}) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			select: {
				...returnUserObject,
				favorites: {
					select: { ...bookReturnObjectFullest }
				},
				...selectObject
			}
		})

		if (!user) throw new NotFoundException('User not found')

		return user
	}

	async update(userId: number, dto: UserDto) {
		const currentUser = await this.byId(userId)

		await this.validateDto(currentUser.email, dto)

		const updatedUser = await this.prisma.user.update({
			where: { id: userId },
			data: {
				email: dto.email,
				password: dto.password
					? await hash(dto.password)
					: currentUser.password,
				phone: dto.phone,
				avatarPath: dto.avatarPath,
				name: dto.name
			}
		})

		return updatedUser
	}

	async toggleFavorites(userId: number, bookId: number) {
		const user = await this.byId(userId)

		const isExist = user.favorites.some(product => product.id === bookId)

		await this.prisma.user.update({
			where: { id: userId },
			data: {
				favorites: {
					[isExist ? 'disconnect' : 'connect']: {
						id: bookId
					}
				}
			}
		})

		return isExist
			? 'Product deleted from favorites'
			: 'Product added to favorites'
	}

	private async validateDto(email: string, dto: UserDto) {
		const isEmailExist = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})

		if (isEmailExist?.email && isEmailExist.email !== email)
			throw new BadRequestException('The email has already been taken')

		return true
	}
}
