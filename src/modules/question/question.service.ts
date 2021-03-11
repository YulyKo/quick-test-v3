import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoldersService } from '../folders/folders.service';

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Questions } from './entities/question.entity';
import { QuestionError } from './question.error';

@Injectable()
export class QuestionService {
  constructor(
    private readonly folderService: FoldersService,

    @InjectRepository(Questions)
    private questionRepository: Repository<Questions>,
  ) {}

  async create(userId: string, createQuestionDto: CreateQuestionDto) {
    const folder = await this.folderService.getById(
      userId,
      createQuestionDto.folderId || userId,
    );
    // question record
    const question = this.questionRepository.create({
      ...createQuestionDto,
      user: {
        id: userId,
      },
      folder,
    });

    await this.questionRepository.save(question);

    return question;
  }

  async getAll(userId: string) {
    const questions = await this.questionRepository
      .createQueryBuilder('questions')
      .where({ user: userId })
      .leftJoin('questions.folder', 'folder')
      .addSelect(['folder.id'])
      .leftJoinAndSelect('questions.answers', 'answers')
      .getMany();

    return questions;
  }

  async getById(userId: string, id: string) {
    const question = await this.questionRepository
      .createQueryBuilder('questions')
      .where({ user: userId, id })
      .leftJoin('questions.folder', 'folder')
      .addSelect(['folder.id'])
      .leftJoinAndSelect('questions.answers', 'answers')
      .getOne();

    if (!question)
      throw new QuestionError('user does not have question with this id');

    return question;
  }

  async getByIds(user_id: string, ids: string[]) {
    const questions = await this.questionRepository
      .createQueryBuilder('questions')
      .where({ user: user_id })
      .andWhereInIds(ids)
      .leftJoin('questions.folder', 'folder')
      .addSelect(['folder.id'])
      .leftJoinAndSelect('questions.answers', 'answers')
      .getMany();

    if (questions.length !== ids.length)
      throw new QuestionError(
        'user does not have one of questions with requested id',
      );

    return questions;
  }

  async updateById(
    userId: string,
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ) {
    const question = await this.getById(userId, id);

    const updatedQuestion = { ...question, ...updateQuestionDto };

    if (updateQuestionDto.folderId) {
      const newParent = await this.folderService.getById(
        userId,
        updateQuestionDto.folderId,
      );
      updatedQuestion.folder = newParent;
    }

    await this.questionRepository.save(updatedQuestion);
    return updatedQuestion;
  }

  async removeById(userId: string, id: string) {
    const question = await this.getById(userId, id);
    await this.questionRepository.softRemove(question);
  }
}
