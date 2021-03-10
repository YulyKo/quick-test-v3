import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { QuestionError } from '../question/question.error';
import { AnswerError } from './answers.error';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { ResponseAnswersDto } from './dto/response-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswersHttpService {
  constructor(private readonly answersService: AnswersService) {}

  async create(
    userId: string,
    questionId: string,
    createAnswerDto: CreateAnswerDto,
  ) {
    try {
      const answer = await this.answersService.create(
        userId,
        questionId,
        createAnswerDto,
      );

      const responseAnswer = plainToClass(ResponseAnswersDto, answer);
      return responseAnswer;
    } catch (error) {
      if (error instanceof QuestionError || error instanceof AnswerError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll(userId: string, questionId: string) {
    try {
      const answers = await this.answersService.getAll(userId, questionId);
      return answers.map((answer) => plainToClass(ResponseAnswersDto, answer));
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getById(userId: string, questionId: string, id: string) {
    try {
      const answer = await this.answersService.getById(userId, questionId, id);
      const responseAnswer = plainToClass(ResponseAnswersDto, answer);
      return responseAnswer;
    } catch (error) {
      if (error instanceof AnswerError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateById(
    userId: string,
    questionId: string,
    id: string,
    updateAnswerDto: UpdateAnswerDto,
  ) {
    try {
      const answer = await this.answersService.updateById(
        userId,
        questionId,
        id,
        updateAnswerDto,
      );
      const responseAnswer = plainToClass(ResponseAnswersDto, answer);
      return responseAnswer;
    } catch (error) {
      if (error instanceof QuestionError || error instanceof AnswerError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteById(userId: string, questionId: string, id: string) {
    try {
      await this.answersService.deleteById(userId, questionId, id);
    } catch (error) {
      if (error instanceof QuestionError || error instanceof AnswerError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
