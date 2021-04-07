import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { QuestionsError } from '../errors/questions.error';
import { AnswerError } from '../errors/answers.error';
import { AnswersService } from './answers.service';
import { CreateAnswersDto } from '../dto/create-answers.dto';
import { ResponseAnswersDto } from '../dto/response-answers.dto';
import { UpdateAnswersDto } from '../dto/update-answers.dto';
import { QuestionsService } from './questions.service';

@Injectable()
export class AnswersHttpService {
  constructor(
    private readonly answersService: AnswersService,
    private readonly questionsService: QuestionsService,
  ) {}

  async create(
    userId: string,
    questionId: string,
    createAnswerDtos: CreateAnswersDto[],
  ) {
    try {
      const question = await this.questionsService.getById(userId, questionId);
      const answers = await Promise.all(
        createAnswerDtos.map((createAnswerDto) =>
          this.answersService.create(question, createAnswerDto),
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
      const question = await this.questionsService.getById(userId, questionId);
      const answers = await this.answersService.getAll(question);
      return answers.map((answer) => plainToClass(ResponseAnswersDto, answer));
    } catch (error) {
      if (error instanceof AnswerError || error instanceof QuestionsError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getByIds(userId: string, questionId: string, ids: string[]) {
    try {
      const question = await this.questionsService.getById(userId, questionId);
      const answers = await Promise.all(
        ids.map((id) => this.answersService.getById(question, id)),
      );
      return answers.map((answer) => plainToClass(ResponseAnswersDto, answer));
    } catch (error) {
      if (error instanceof AnswerError || error instanceof QuestionsError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateByIds(
    userId: string,
    questionId: string,
    ids: string[],
    updateAnswerDtos: UpdateAnswersDto[],
  ) {
    try {
      const question = await this.questionsService.getById(userId, questionId);
      const answers = await Promise.all(
        ids.map((id, index) =>
          this.answersService.updateById(question, id, updateAnswerDtos[index]),
        ),
      );
      return answers.map((answer) => plainToClass(ResponseAnswersDto, answer));
    } catch (error) {
      if (error instanceof QuestionsError || error instanceof AnswerError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteByIds(userId: string, questionId: string, ids: string[]) {
    try {
      const question = await this.questionsService.getById(userId, questionId);
      await Promise.all(
        ids.map((id) => this.answersService.deleteById(question, id)),
      );
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
