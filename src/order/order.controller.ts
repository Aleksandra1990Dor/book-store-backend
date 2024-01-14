import {
	Controller,
	Get,
	Body,
	UsePipes,
	ValidationPipe,
	Post,
	HttpCode
} from '@nestjs/common'
import { OrderService } from './order.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { OrderDto } from './dto/order.dto'

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Get()
	@Auth('admin')
	async getAllOrders() {
		return this.orderService.getAllOrders()
	}

	@Get('by-user')
	@Auth()
	async getByUserId(@CurrentUser('id') id: number) {
		return this.orderService.getByUser(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post()
	async placeOrder(@CurrentUser('id') id: number, @Body() dto: OrderDto) {
		return this.orderService.placeOrder(dto, id)
	}
}
