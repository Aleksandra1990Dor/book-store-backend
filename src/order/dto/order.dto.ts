import { Type } from 'class-transformer'
import { IsNumber, IsArray, ValidateNested } from 'class-validator'

export class OrderItemDto {
	@IsNumber()
	quantity: number

	@IsNumber()
	price: number

	@IsNumber()
	productId: number
}

export class OrderDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => OrderItemDto)
	orders: OrderItemDto[]
}
