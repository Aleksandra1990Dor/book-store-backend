import {
	Injectable,
	BadRequestException,
	UnauthorizedException,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { AuthDto, FullAuthDto } from './dto/auth.dto'
import { hash, verify } from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
		private readonly userService: UserService
	) {}

	async register(dto: FullAuthDto) {
		const existedUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})

		if (existedUser)
			throw new BadRequestException('The email has already been taken')

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				password: await hash(dto.password),
				isAdmin: false,
				name: '',
				avatarPath: dto.avatarPath,
				phone: ''
			}
		})

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async getNewTokens(dto: RefreshTokenDto) {
		const result = await this.jwtService.verifyAsync(dto.refreshToken)

		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const user = await this.userService.byId(result.id, { isAdmin: true })

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})
		if (!user) throw new NotFoundException('User not found')

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new BadRequestException('Invalid password')

		return user
	}

	private async issueTokens(userId: number) {
		const data = { id: userId }

		const accessToken = this.jwtService.sign(data, {
			expiresIn: '1h'
		})

		const refreshToken = this.jwtService.sign(data, {
			expiresIn: '7d'
		})

		return { accessToken, refreshToken }
	}

	private returnUserFields(user: Partial<User>) {
		return {
			id: user.id,
			email: user.email,
			avatarPath: user.avatarPath,
			name: user.name
		}
	}
}
