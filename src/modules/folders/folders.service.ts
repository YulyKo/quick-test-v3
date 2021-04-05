import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFoldersDto } from './dto/create-folders.dto';
import { UpdateFoldersDto } from './dto/update-folders.dto';
import { Folders } from './entities/folders.entity';
import { FoldersError } from './folders.error';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folders)
    private folderRepository: Repository<Folders>,
  ) {}

  async create(
    userId: string,
    createFolderDto: CreateFoldersDto,
    isMainFolder?: boolean,
  ) {
    const folder = this.folderRepository.create({
      ...createFolderDto,
      user: { id: userId },
    });
    if (isMainFolder) {
      folder.id = userId;
    } else {
      folder.parent = createFolderDto.folderId
        ? await this.getById(userId, createFolderDto.folderId)
        : await this.getById(userId, userId);
    }
    await this.folderRepository.save(folder);
    return folder;
  }

  async getAll(userId: string) {
    const folders = await this.folderRepository
      .createQueryBuilder('folders')
      .where({ user: userId })
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

  async getById(userId: string, id: string) {
    const folder = await this.folderRepository
      .createQueryBuilder('folders')
      .where({ user: userId, id })
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

  async getAllById(userId: string, id: string) {
    const folder = await this.folderRepository
      .createQueryBuilder('folders')
      .where({ user: userId, id })
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
        'questions.answerType',
        'questions.created',
        'questions.updated',
      ])
      .leftJoin('folders.tests', 'tests', 'tests.deleted IS NULL')
      .addSelect([
        'tests.id',
        'tests.name',
        'tests.code',
        'tests.created',
        'tests.updated',
      ])
      .getOne();
    if (!folder)
      throw new FoldersError("user doesn't have folder with this id");
    return folder;
  }

  async updateById(
    userId: string,
    id: string,
    updateFoldersDto: UpdateFoldersDto,
  ) {
    const folder = await this.getById(userId, id);

    const newFolder = { ...folder, ...updateFoldersDto };

    if (updateFoldersDto.folderId) {
      if (updateFoldersDto.folderId === id)
        throw new FoldersError('folder id and id has equal value');
      newFolder.parent = await this.getById(userId, updateFoldersDto.folderId);
    }
    await this.folderRepository.save(newFolder);
    return newFolder;
  }

  async removeById(userId: string, id: string) {
    const folder = await this.getAllById(userId, id);
    await this.folderRepository.softRemove(folder);
  }
}
