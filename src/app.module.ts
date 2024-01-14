import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'
import { PrismaService } from './prisma.service'
import { AuthModule } from './auth/auth.module'
import { AuthorModule } from './author/author.module'
import { OrderModule } from './order/order.module'
import { UserModule } from './user/user.module'
import { BookModule } from './book/book.module'
import { CategoryModule } from './category/category.module'
import { ConfigModule } from '@nestjs/config'
import { FileModule } from './file/file.module'

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads'
		}),
		AuthModule,
		ConfigModule.forRoot(),
		AuthorModule,
		OrderModule,
		UserModule,
		BookModule,
		CategoryModule,
		FileModule
	],
	controllers: [AppController],
	providers: [AppService, PrismaService]
})
export class AppModule {}
