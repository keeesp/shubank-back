import { faker } from '@faker-js/faker'
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { hash, verify } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { AuthDto } from './auth.dto'
import { RefreshTokenDto } from './refresh-token.dto'

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private readonly jwtService: JwtService
	) {}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)
		const tokens = await this.issueTokenPair(String(user.id))

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async register(dto: AuthDto) {
		const oldUser = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})
		if (oldUser) throw new BadRequestException('Email занят')

		const user = await this.prisma.user.create({
			data: {
				name: faker.internet.userName(),
				email: dto.email,
				password: await hash(dto.password),
				address: faker.address.city() + ', ' + faker.address.street(),
				avatarPath: faker.image.avatar()
			}
		})

		const tokens = await this.issueTokenPair(String(user.id))
		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		if (!refreshToken) throw new UnauthorizedException('Please sign in!')

		const result = await this.jwtService.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Invalid token or expired!')

		const user = await this.prisma.user.findUnique({
			where: { id: +result.id }
		})

		const tokens = await this.issueTokenPair(String(user.id))

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async validateUser(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})

		if (!user) throw new NotFoundException('User not found!')

		const isValidPassword = await verify(user.password, dto.password)
		if (!isValidPassword)
			throw new UnauthorizedException('Не правильный пароль!')

		return user
	}

	async issueTokenPair(userId: string) {
		const data = { id: userId }

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '15d'
		})

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '1h'
		})

		return { refreshToken, accessToken }
	}

	returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email
		}
	}
}
