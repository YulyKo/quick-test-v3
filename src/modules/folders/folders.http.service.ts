import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateFolderDto } from './dto/create-folder.dto';
import { ResponseFolderDto } from './dto/response-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FoldersError } from './folders.error';
import { FoldersService } from './folders.service';

@Injectable()
export class FoldersHttpService {
  constructor(private readonly foldersService: FoldersService) {}

  async create(user_id: string, createFolderDto: CreateFolderDto) {
    try {
      const folder = await this.foldersService.create(user_id, createFolderDto);

      const responseFolder = plainToClass(ResponseFolderDto, folder);
      return responseFolder;
    } catch (error) {
      if (error instanceof FoldersError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll(user_id: string) {
    try {
      const folders = await this.foldersService.getAll(user_id);
      return folders.map((folder) => plainToClass(ResponseFolderDto, folder));
    } catch (error) {
      if (error instanceof FoldersError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getById(user_id: string, id: string) {
    try {
      const folder = await this.foldersService.getById(user_id, id);
      const responseFolder = plainToClass(ResponseFolderDto, folder);
      return responseFolder;
    } catch (error) {
      if (error instanceof FoldersError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateById(
    user_id: string,
    id: string,
    updateFolderDto: UpdateFolderDto,
  ) {
    try {
      const folder = await this.foldersService.updateById(
        user_id,
        id,
        updateFolderDto,
      );
      const responseFolder = plainToClass(ResponseFolderDto, folder);
      return responseFolder;
    } catch (error) {
      if (error instanceof FoldersError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteById(user_id: string, id: string) {
    try {
      await this.foldersService.removeById(user_id, id);
    } catch (error) {
      if (error instanceof FoldersError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
