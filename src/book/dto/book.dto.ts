import { Prisma } from '@prisma/client'
import {
	ArrayMinSize,
	IsNumber,
	IsOptional,
	IsString,
	IsBoolean
} from 'class-validator'

export class BookDto implements Prisma.BookUpdateInput {
	@IsString()
	name: string

	@IsString()
	slug: string

	@IsNumber()
	price: number

	@IsOptional()
	@IsString()
	description: string

	@IsString({ each: true })
	@ArrayMinSize(1)
	images: string[]

	@IsNumber()
	categoryId: number

	@IsBoolean()
	isAudioAvailable: boolean

	@IsOptional()
	@IsString()
	audioUrl: string

	@IsNumber()
	authorId: number
}
