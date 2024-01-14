import { IsEnum, IsOptional, IsString } from 'class-validator'

export enum EnumBooksSort {
	BOOKS = 'name',
	AUTHORS = 'author',
	AUDIO = 'isAudioAvailable'
}

export class GetAllBooksDto {
	@IsOptional()
	@IsEnum(EnumBooksSort)
	sort?: EnumBooksSort

	@IsOptional()
	@IsString()
	searchTerm?: string
}
