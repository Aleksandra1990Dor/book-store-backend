import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { OrderDto } from './dto/order.dto'
import { bookReturnObjectFullest } from 'src/book/utils/return-book.object'

@Injectable()
export class OrderService {
	constructor(private readonly prisma: PrismaService) {}

	async getAllOrders() {
		return this.prisma.order.findMany({
			include: {
				items: { include: { product: { select: bookReturnObjectFullest } } }
			},
			orderBy: { createdAt: 'desc' }
		})
	}

	async getByUser(userId: number) {
		return this.prisma.order.findMany({
			where: { userId },
			include: {
				items: { include: { product: { select: bookReturnObjectFullest } } }
			},
			orderBy: { createdAt: 'desc' }
		})
	}

	private async byId(orderId: number) {
		const order = this.prisma.order.findUnique({
			where: { id: orderId }
		})

		if (!order) throw new NotFoundException('Order not found')

		return order
	}

	async placeOrder(dto: OrderDto, userId: number) {
		const totalAmount = dto.orders.reduce<number>(
			(acc, item) => acc + item.price * item.quantity,
			0
		)

		const order = await this.prisma.order.create({
			data: {
				status: dto.status,
				total: totalAmount,
				user: { connect: { id: userId } },
				items: {
					create: dto.orders
				}
			},
			include: {
				items: {
					include: {
						product: { select: bookReturnObjectFullest }
					}
				}
			}
		})

		return order
	}
}
