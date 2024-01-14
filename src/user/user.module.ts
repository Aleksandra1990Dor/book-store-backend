import { PrismaService } from '../prisma.service'
import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService],
	exports: [UserService]
})
export class UserModule {}
