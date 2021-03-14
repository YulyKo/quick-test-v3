import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FoldersService } from '../folders/folders.service';
import { CreateQuestionsDto } from './dto/create-questions.dto';
import { UpdateQuestionsDto } from './dto/update-questions.dto';
import { Questions } from './entities/questions.entity';
import { QuestionsError } from './questions.error';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly foldersService: FoldersService,

    @InjectRepository(Questions)
    private questionsRepository: Repository<Questions>,
  ) {}

  async create(userId: string, createQuestionsDto: CreateQuestionsDto) {
    const folder = await this.foldersService.getById(
      userId,
      createQuestionsDto.folderId || userId,
    );
    // question record
    const question = this.questionsRepository.create({
      ...createQuestionsDto,
      user: {
        id: userId,
      },
      folder,
    });

    await this.questionsRepository.save(question);

    return question;
  }

  async getAll(userId: string) {
    const questions = await this.questionsRepository
      .createQueryBuilder('questions')
      .where({ user: userId })
      .leftJoin('questions.folder', 'folder')
      .addSelect(['folder.id'])
      .leftJoinAndSelect('questions.answers', 'answers')
      .getMany();

    return questions;
  }

  async getById(userId: string, id: string) {
    const question = await this.questionsRepository
      .createQueryBuilder('questions')
      .where({ user: userId, id })
      .leftJoin('questions.folder', 'folder')
      .addSelect(['folder.id'])
      .leftJoinAndSelect('questions.answers', 'answers')
      .getOne();

    if (!question)
      throw new QuestionsError('user does not have question with this id');

    return question;
  }

  async getByIds(userId: string, ids: string[]) {
    const questions = await this.questionsRepository
      .createQueryBuilder('questions')
      .where({ user: userId })
      .andWhereInIds(ids)
      .leftJoin('questions.folder', 'folder')
      .addSelect(['folder.id'])
      .leftJoinAndSelect('questions.answers', 'answers')
      .getMany();

    if (questions.length !== ids.length)
      throw new QuestionsError(
        'user does not have one of questions with requested id',
      );

    return questions;
  }

  async updateById(
    userId: string,
    id: string,
    updateQuestionsDto: UpdateQuestionsDto,
  ) {
    const question = await this.getById(userId, id);

    const updatedQuestion = { ...question, ...updateQuestionsDto };

    if (updateQuestionsDto.folderId) {
      const newParent = await this.foldersService.getById(
        userId,
        updateQuestionsDto.folderId,
      );
      updatedQuestion.folder = newParent;
    }

    await this.questionsRepository.save(updatedQuestion);
    return updatedQuestion;
  }

  async removeById(userId: string, id: string) {
    const question = await this.getById(userId, id);
    await this.questionsRepository.softRemove(question);
  }
}
