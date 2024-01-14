import { Prisma } from '@prisma/client';
import { IsString } from 'class-validator';

export class AuthorDto implements Prisma.AuthorUpdateInput {
  @IsString()
  fullName: string;

  @IsString()
  slug: string;

  @IsString()
  avatarPath: string;
}
