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
    const folders = await this.folderRepository
      .createQueryBuilder('folders')
      .where({ user: user_id })
      .andWhere('folders.parent NOTNULL')
      .select([
        'folders.id',
        'folders.name',
        'folders.color',
        'folders.created',
        'folders.updated',
      ])
      .leftJoin('folders.parent', 'parent')
      .addSelect(['parent.id'])
      .getMany();
    return folders;
  }

  async getById(user_id: string, id: string) {
    const folder = await this.folderRepository
      .createQueryBuilder('folders')
      .where({ user: user_id, id })
      .select([
        'folders.id',
        'folders.name',
        'folders.color',
        'folders.created',
        'folders.updated',
      ])
      .leftJoin('folders.parent', 'parent')
      .addSelect(['parent.id'])
      .getOne();
    if (!folder)
      throw new FoldersError("user doesn't have folder with this id");
    return folder;
  }

  async getAllById(user_id: string, id: string) {
    const folder = await this.folderRepository
      .createQueryBuilder('folders')
      .where({ user: user_id, id })
      .leftJoin('folders.children', 'children', 'children.deleted IS NULL')
      .addSelect([
        'children.id',
        'children.name',
        'children.color',
        'children.created',
        'children.updated',
      ])
      .leftJoin('folders.questions', 'questions', 'questions.deleted IS NULL')
      .addSelect([
        'questions.id',
        'questions.name',
        'questions.answer_type',
        'questions.created',
        'questions.updated',
      ])
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
      if (updateFolderDto.parent_id === id)
        throw new FoldersError('folder id and parent_id has equal value');
      newFolder.parent =
        updateFolderDto.parent_id !== 'main'
          ? await this.getById(user_id, updateFolderDto.parent_id)
          : await this.getById(user_id, user_id);
    }
    await this.folderRepository.save(newFolder);
    return folder;
  }

  async removeById(user_id: string, id: string) {
    const folder = await this.getAllById(user_id, id);
    await this.folderRepository.softRemove(folder);
  }
}
