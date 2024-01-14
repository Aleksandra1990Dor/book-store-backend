import { FileService } from './file.service'
import {
	Controller,
	Post,
	HttpCode,
	UseInterceptors,
	UploadedFile,
	Query
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('files')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Post()
	@HttpCode(200)
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@Query('folder') folder?: string
	) {
		return this.fileService.saveFiles([file], folder)
	}
}
