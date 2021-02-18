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

  private async _create(
    user_id: string,
    createFolderDto: CreateFolderDto,
    parent?: Folders,
  ) {
    const folder = this.folderRepository.create({
      ...createFolderDto,
      user: { id: user_id },
      parent,
    });
    await this.folderRepository.save(folder);
    return folder;
  }

  async getParent(user_id: string, parent_id: string) {
    const parent = await this.folderRepository.findOne({
      where: {
        id: parent_id,

        user: {
          id: user_id,
        },
      },
    });

    if (!parent)
      throw new FoldersError(
        `this user doesn't have parent with this parentId: ${parent_id}`,
      );
    return parent;
  }

  async createInParent(
    user_id: string,
    parent_id: string,
    createFolderDto: CreateFolderDto,
  ) {
    try {
      const parent = await this.getParent(user_id, parent_id);
      const folder = await this._create(user_id, createFolderDto, parent);
      return folder;
    } catch (error) {
      throw error;
    }
  }

  async createInMain(user_id: string, createFolderDto: CreateFolderDto) {
    try {
      const folder = await this._create(user_id, createFolderDto);
      return folder;
    } catch (error) {
      throw error;
    }
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

  async updateById(
    user_id: string,
    id: string,
    updateFolderDto: UpdateFolderDto,
  ) {
    const folder = await this.getById(user_id, id);

    const newFolder = { ...folder, ...updateFolderDto };

    if (updateFolderDto.parent_id) {
      if (updateFolderDto.parent_id === 'main') {
        newFolder.parent = null;
      } else {
        const parent = await this.getById(user_id, updateFolderDto.parent_id);
        newFolder.parent = parent;
      }
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
