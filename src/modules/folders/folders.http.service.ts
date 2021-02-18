import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FoldersError } from './folders.error';
import { FoldersService } from './folders.service';

@Injectable()
export class FoldersHttpService {
  constructor(private readonly foldersService: FoldersService) {}

  async create(
    user_id: string,
    createFolderDto: CreateFolderDto,
    parent_id?: string,
  ) {
    try {
      const folder = parent_id
        ? await this.foldersService.createInParent(
            user_id,
            parent_id,
            createFolderDto,
          )
        : await this.foldersService.createInMain(user_id, createFolderDto);

      return {
        message: 'folder successful created',
        id: folder.id,
      };
    } catch (error) {
      if (error instanceof FoldersError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async get(user_id: string) {
    try {
      const folders = await this.foldersService.getFromMain(user_id);
      return folders;
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
      const folders = await this.foldersService.getFromParent(user_id, id);
      return folders;
    } catch (error) {
      if (error instanceof FoldersError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(user_id: string, id: string, updateFolderDto: UpdateFolderDto) {
    try {
      const folder = await this.foldersService.updateById(
        user_id,
        id,
        updateFolderDto,
      );
      return {
        message: 'folder successful updated',
        id: folder.id,
      };
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
      const folder = await this.foldersService.removeByID(user_id, id);
      return {
        id: folder.id,
        message: 'folder successfully deleted',
      };
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
