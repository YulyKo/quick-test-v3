import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { FoldersError } from '../folders/folders.error';
import { CreateQuestionsDto } from './dto/create-questions.dto';
import { ResponseQuestionsDto } from './dto/response-questions.dto';
import { UpdateQuestionsDto } from './dto/update-questions.dto';
import { QuestionsError } from './questions.error';
import { QuestionsService } from './questions.service';

@Injectable()
export class QuestionsHttpService {
  constructor(private readonly questionsService: QuestionsService) {}

  async create(userId: string, createQuestionsDto: CreateQuestionsDto) {
    try {
      const question = await this.questionsService.create(
        userId,
        createQuestionsDto,
      );

      const responseQuestion = plainToClass(ResponseQuestionsDto, question);
      return responseQuestion;
    } catch (error) {
      if (error instanceof QuestionsError || error instanceof FoldersError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll(userId: string) {
    try {
      const questions = await this.questionsService.getAll(userId);
      return questions.map((question) =>
        plainToClass(ResponseQuestionsDto, question),
      );
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getById(userId: string, id: string) {
    try {
      const question = await this.questionsService.getById(userId, id);
      const responseQuestion = plainToClass(ResponseQuestionsDto, question);
      return responseQuestion;
    } catch (error) {
      if (error instanceof QuestionsError)
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
    updateQuestionDto: UpdateQuestionsDto,
  ) {
    try {
      const question = await this.questionsService.updateById(
        userId,
        id,
        updateQuestionDto,
      );
      const responseQuestion = plainToClass(ResponseQuestionsDto, question);
      return responseQuestion;
    } catch (error) {
      if (error instanceof QuestionsError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteById(userId: string, id: string) {
    try {
      await this.questionsService.removeById(userId, id);
    } catch (error) {
      if (error instanceof QuestionsError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
