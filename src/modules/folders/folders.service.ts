import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { Folders } from './entities/folders.entity';
import { FoldersError } from './folders.error';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folders)
    private folderRepository: Repository<Folders>,
  ) {}

  async create(
    user_id: string,
    createFolderDto: CreateFolderDto,
    isMainFolder?: boolean,
  ) {
    const folder = this.folderRepository.create({
      ...createFolderDto,
      user: { id: user_id },
    });
    if (isMainFolder) {
      folder.id = user_id;
    } else {
      folder.parent = createFolderDto.folder_id
        ? await this.getById(user_id, createFolderDto.folder_id)
        : await this.getById(user_id, user_id);
    }
    await this.folderRepository.save(folder);
    return folder;
  }

  async getAll(user_id: string) {
    const folders = await this.folderRepository.find({
      where: {
        user: {
          id: user_id,
        },
      },
    });
    return folders;
  }

  async getById(user_id: string, id: string) {
    const folder = await this.folderRepository.findOne({
      where: {
        user: {
          id: user_id,
        },
        id,
      },
    });
    if (!folder)
      throw new FoldersError("user doesn't have folder with this id");
    return folder;
  }

  async getAllById(user_id: string, id: string) {
    const folder = await this.folderRepository
      .createQueryBuilder('folders')
      .where({ user: user_id, id })
      .leftJoinAndSelect(
        'folders.children',
        'children',
        'children.deleted IS NULL',
      )
      .leftJoinAndSelect(
        'folders.questions',
        'questions',
        'questions.deleted IS NULL',
      )
      .getOne();
    if (!folder)
      throw new FoldersError("user doesn't have folder with this id");
    return folder;
  }

  async updateById(
    user_id: string,
    id: string,
    updateFolderDto: UpdateFolderDto,
  ) {
    const folder = await this.getById(user_id, id);

    const newFolder = { ...folder, ...updateFolderDto };

    if (updateFolderDto.parent_id) {
      newFolder.parent =
        updateFolderDto.parent_id !== 'main'
          ? await this.getById(user_id, updateFolderDto.parent_id)
          : await this.getById(user_id, user_id);
    }
    await this.folderRepository.save(newFolder);
    return folder;
  }

  async removeByID(user_id: string, id: string) {
    const folder = await this.getById(user_id, id);
    await this.folderRepository.softDelete({
      id: folder.id,
    });
    return folder;
  }
}
