import { EnumOrderStatus } from '@prisma/client'
import { Type } from 'class-transformer'
import {
	IsEnum,
	IsNumber,
	IsArray,
	ValidateNested,
	IsOptional
} from 'class-validator'

export class OrderItemDto {
	@IsNumber()
	quantity: number

	@IsNumber()
	price: number

	@IsNumber()
	productId: number
}

export class OrderDto {
	@IsOptional()
	@IsEnum(EnumOrderStatus)
	status?: EnumOrderStatus

	@IsNumber()
	price: number

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => OrderItemDto)
	orders: OrderItemDto[]
}
