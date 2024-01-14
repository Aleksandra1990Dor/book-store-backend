import { applyDecorators, UseGuards } from '@nestjs/common'
import { TypeRole } from '../dto/auth.interface'
import { JwtAuthGuard } from '../guards/gwt.guard'
import { OnlyAdminGuard } from '../guards/admin.guard'

export const Auth = (role: TypeRole = 'user') =>
	applyDecorators(
		role === 'admin'
			? UseGuards(JwtAuthGuard, OnlyAdminGuard)
			: UseGuards(JwtAuthGuard)
	)
