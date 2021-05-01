import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateFoldersDto } from './dto/create-folders.dto';
import { ResponseFoldersDto } from './dto/response-folders.dto';
import { UpdateFoldersDto } from './dto/update-folders.dto';
import { FoldersError } from './folders.error';
import { FoldersService } from './folders.service';
import { LoggerService } from '../../utils/logger.service';

@Injectable()
export class FoldersHttpService {
  logger = new LoggerService(FoldersHttpService.name);

  constructor(private readonly foldersService: FoldersService) {}

  async create(userId: string, createFoldersDto: CreateFoldersDto) {
    try {
      const folder = await this.foldersService.create(userId, createFoldersDto);
      this.logger.debug(
        `Folder created, with id: ${folder.id}, for user ${userId}`,
        this.create.name,
      );
      return plainToClass(ResponseFoldersDto, folder);
    } catch (error) {
      if (error instanceof FoldersError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll(userId: string) {
    try {
      const folders = await this.foldersService.getAll(userId);
      return folders.map((folder) => plainToClass(ResponseFoldersDto, folder));
    } catch (error) {
      if (error instanceof FoldersError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getById(userId: string, id: string) {
    try {
      const folder = await this.foldersService.getById(userId, id);
      const responseFolder = plainToClass(ResponseFoldersDto, folder);
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
    userId: string,
    id: string,
    updateFolderDto: UpdateFoldersDto,
  ) {
    try {
      const folder = await this.foldersService.updateById(
        userId,
        id,
        updateFolderDto,
      );
      const responseFolder = plainToClass(ResponseFoldersDto, folder);
      this.logger.debug(
        `Folder updated, with id: ${id}, for user ${userId}`,
        this.updateById.name,
      );
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

  async deleteById(userId: string, id: string) {
    try {
      await this.foldersService.removeById(userId, id);
      this.logger.debug(
        `Folder deleted, with id: ${id}, for user ${userId}`,
        this.deleteById.name,
      );
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
