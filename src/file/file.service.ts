import { Injectable } from '@nestjs/common'
import { ensureDir, writeFile } from 'fs-extra'
import { FileResponse } from './file.interface'
import { path } from 'app-root-path'

@Injectable()
export class FileService {
	async saveFiles(
		files: Express.Multer.File[],
		folder?: string
	): Promise<FileResponse[]> {
		const uploadFolder = folder
			? `${path}/uploads/${folder}`
			: `${path}/uploads/default`

		await ensureDir(uploadFolder)

		const res: FileResponse[] = await Promise.all(
			files.map(async file => {
				await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer)

				return {
					url: `/uploads/${folder}/${file.originalname}`,
					name: file.originalname
				}
			})
		)

		return res
	}
}
