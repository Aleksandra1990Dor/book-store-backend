import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { PrismaService } from 'src/prisma.service';
import { AuthorController } from './author.controller';

@Module({
  controllers: [AuthorController],
  providers: [AuthorService, PrismaService],
  exports: [AuthorService],
})
export class AuthorModule {}
