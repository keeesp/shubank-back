import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { hash } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { UserDto } from './user.dto'
import { userOutput } from './user.output'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async byId(id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id
			},
			select: {
				contacts: {
					select: userOutput
				},
				...userOutput
			}
		})

		if (!user) throw new NotFoundException('User not found!')
		return user
	}

	async updateProfile(id: number, dto: UserDto) {
		const isSameUser = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})

		if (isSameUser && id !== isSameUser.id)
			throw new BadRequestException('Email занят')

		const user = await this.prisma.user.findUnique({
			where: {
				id
			}
		})

		return this.prisma.user.update({
			where: {
				id
			},
			data: {
				email: dto.email,
				address: dto.address,
				name: dto.name,
				avatarPath: dto.avatarPath,
				password: dto.password ? await hash(dto.password) : user.password
			}
		})
	}

	async toggleContact(userId: number, contactId: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: { contacts: true }
		})

		if (!user) {
			throw new Error(`User with ID ${userId} not found`)
		}

		const contact = await this.prisma.user.findUnique({
			where: { id: contactId }
		})
		if (!contact) {
			throw new Error(`Contact with ID ${contactId} not found`)
		}

		const isContact = user.contacts.some(
			userContact => userContact.id === contactId
		)

		if (isContact) {
			await this.prisma.user.update({
				where: { id: userId },
				data: { contacts: { disconnect: { id: contactId } } }
			})
			await this.prisma.user.update({
				where: { id: contactId },
				data: { contacts: { disconnect: { id: userId } } }
			})
		} else {
			await this.prisma.user.update({
				where: { id: userId },
				data: { contacts: { connect: { id: contactId } } }
			})
			await this.prisma.user.update({
				where: { id: contactId },
				data: { contacts: { connect: { id: userId } } }
			})
		}
	}

	async getAll() {
		return this.prisma.user.findMany({
			select: {
				contacts: true,
				...userOutput
			}
		})
	}

	async getContacts(userId: number, searchTerm?: string) {
		const user = await this.byId(userId)

		return searchTerm
			? user.contacts.filter(contact =>
					contact.name.toLowerCase().includes(searchTerm.toLowerCase())
			  )
			: user.contacts
	}
}
