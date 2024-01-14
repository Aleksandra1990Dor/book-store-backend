import {
	Controller,
	UsePipes,
	ValidationPipe,
	HttpCode,
	Put,
	Get,
	Body,
	Param,
	Patch
} from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UserDto } from './dto/user.dto'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') userId: number) {
		return this.userService.byId(userId)
	}

	@UsePipes(new ValidationPipe())
	@Put('profile')
	@HttpCode(200)
	@Auth()
	async updateProfile(@CurrentUser('id') userId: number, @Body() dto: UserDto) {
		return this.userService.update(userId, dto)
	}

	@UsePipes(new ValidationPipe())
	@Patch('favorites/:bookId')
	@HttpCode(200)
	@Auth()
	async toggleFavorites(
		@CurrentUser('id') userId: number,
		@Param('bookId') bookId: string
	) {
		return this.userService.toggleFavorites(userId, +bookId)
	}
}
