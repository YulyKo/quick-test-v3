import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { FoldersError } from '../folders/folders.error';

import { CreateQuestionDto } from './dto/create-question.dto';
import { ResponseQuestionDto } from './dto/response-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionError } from './question.error';
import { QuestionService } from './question.service';

@Injectable()
export class QuestionHttpService {
  constructor(private readonly questionService: QuestionService) {}

  async create(userId: string, createQuestionDto: CreateQuestionDto) {
    try {
      const question = await this.questionService.create(
        userId,
        createQuestionDto,
      );

      const responseQuestion = plainToClass(ResponseQuestionDto, question);
      return responseQuestion;
    } catch (error) {
      if (error instanceof QuestionError || error instanceof FoldersError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll(userId: string) {
    try {
      const questions = await this.questionService.getAll(userId);
      return questions.map((question) =>
        plainToClass(ResponseQuestionDto, question),
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
      const question = await this.questionService.getById(userId, id);
      const responseQuestion = plainToClass(ResponseQuestionDto, question);
      return responseQuestion;
    } catch (error) {
      if (error instanceof QuestionError)
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
    updateQuestionDto: UpdateQuestionDto,
  ) {
    try {
      const question = await this.questionService.updateById(
        userId,
        id,
        updateQuestionDto,
      );
      const responseQuestion = plainToClass(ResponseQuestionDto, question);
      return responseQuestion;
    } catch (error) {
      if (error instanceof QuestionError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteById(userId: string, id: string) {
    try {
      await this.questionService.removeById(userId, id);
    } catch (error) {
      if (error instanceof QuestionError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
