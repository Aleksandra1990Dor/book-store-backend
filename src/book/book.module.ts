import { Module } from '@nestjs/common'
import { BookService } from './book.service'
import { BookController } from './book.controller'
import { PrismaService } from 'src/prisma.service'
import { CategoryService } from 'src/category/category.service'

@Module({
	controllers: [BookController],
	providers: [BookService, PrismaService, CategoryService],
	exports: [BookService]
})
export class BookModule {}
