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
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async getAll(user_id: string) {
    try {
      const questions = await this.questionRepository.find({
        where: {
          user: {
            id: user_id,
          },
        },
        relations: ['answers'],
      });
      return questions;
    } catch (error) {
      throw error;
    }
  }

  async getById(user_id: string, id: string) {
    try {
      const question = await this.questionRepository.findOne({
        where: {
          id,
          user: {
            id: user_id,
          },
        },
        relations: ['answers'],
      });

      if (!question)
        throw new QuestionError('user does not have question with this id');

      return question;
    } catch (error) {
      throw error;
    }
  }

  async update(
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

  async remove(user_id: string, id: string) {
    try {
      const question = await this.getById(user_id, id);
      await this.questionRepository.softDelete({ id: question.id });
      return {
        id,
      };
    } catch (error) {
      throw error;
    }
  }
}
