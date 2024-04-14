import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { EntityManager, Repository } from 'typeorm';

import { File } from '../../../entities';

import { SaveFileDataDto } from './dto/save-file-data.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly entityManager: EntityManager,
  ) {}

  async uploadLocal(file: any): Promise<any> {
    try {
      const baseDir = './dist/public';
      const filetime = Math.abs(new Date().getTime());
      const filename = `${filetime}-${file.originalname}`;
      const filedir = `${baseDir}/${filename}`;
      const filesplit = file.originalname.split('.');
      const extension = filesplit[filesplit.length - 1];
      if (!fs.existsSync(baseDir)) await fs.mkdirSync(baseDir);
      await fs.writeFileSync(filedir, file.buffer);
      return {
        filename,
        extension,
        size: file.size,
      };
    } catch {
      return null;
    }
  }

  async saveFileData(data: SaveFileDataDto): Promise<File> {
    let result: File = null;
    try {
      const file = new File(data);
      result = await this.entityManager.save(file);
      return result;
    } catch {
      return result;
    }
  }
}
