import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { QuestionsError } from '../questions/questions.error';
import { AnswerError } from './answers.error';
import { AnswersService } from './answers.service';
import { CreateAnswersDto } from './dto/create-answers.dto';
import { ResponseAnswersDto } from './dto/response-answers.dto';
import { UpdateAnswersDto } from './dto/update-answers.dto';

@Injectable()
export class AnswersHttpService {
  constructor(private readonly answersService: AnswersService) {}

  async create(
    userId: string,
    questionId: string,
    createAnswerDtos: CreateAnswersDto[],
  ) {
    try {
      const answers = await Promise.all(
        createAnswerDtos.map((createAnswerDto) =>
          this.answersService.create(userId, questionId, createAnswerDto),
        ),
      );
      return answers.map((answer) => plainToClass(ResponseAnswersDto, answer));
    } catch (error) {
      if (error instanceof QuestionsError || error instanceof AnswerError)
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
    updateAnswerDto: UpdateAnswersDto,
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
      if (error instanceof QuestionsError || error instanceof AnswerError)
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
      if (error instanceof QuestionsError || error instanceof AnswerError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
