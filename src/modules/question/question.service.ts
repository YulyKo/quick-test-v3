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

  async create(user_id: string, createQuestionDto: CreateQuestionDto) {
    const folder = await this.folderService.getById(
      user_id,
      createQuestionDto.folder_id || user_id,
    );
    // question record
    const question = this.questionRepository.create({
      ...createQuestionDto,
      user: {
        id: user_id,
      },
      folder,
    });

    await this.questionRepository.save(question);

    return question;
  }

  async getAll(user_id: string) {
    const questions = await this.questionRepository
      .createQueryBuilder('questions')
      .where({ user: user_id })
      .leftJoin('questions.folder', 'folder')
      .addSelect(['folder.id'])
      .leftJoinAndSelect('questions.answers', 'answers')
      .getMany();

    return questions;
  }

  async getById(user_id: string, id: string) {
    const question = await this.questionRepository
      .createQueryBuilder('questions')
      .where({ user: user_id, id })
      .leftJoin('questions.folder', 'folder')
      .addSelect(['folder.id'])
      .leftJoinAndSelect('questions.answers', 'answers')
      .getOne();

    if (!question)
      throw new QuestionError('user does not have question with this id');

    return question;
  }

  async updateById(
    user_id: string,
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ) {
    const question = await this.getById(user_id, id);

    const updatedQuestion = { ...question, ...updateQuestionDto };

    if (updateQuestionDto.folder_id) {
      const newParent = await this.folderService.getById(
        user_id,
        updateQuestionDto.folder_id !== 'main'
          ? updateQuestionDto.folder_id
          : user_id,
      );
      updatedQuestion.folder = newParent;
    }

    await this.questionRepository.save(updatedQuestion);
    return updatedQuestion;
  }

  async removeById(user_id: string, id: string) {
    const question = await this.getById(user_id, id);
    await this.questionRepository.softRemove(question);
  }
}
