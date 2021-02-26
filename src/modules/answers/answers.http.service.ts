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
    user_id: string,
    question_id: string,
    createAnswerDto: CreateAnswerDto,
  ) {
    try {
      const answer = await this.answersService.create(
        user_id,
        question_id,
        createAnswerDto,
      );

      const responseAnswer = plainToClass(ResponseAnswersDto, answer);
      return responseAnswer;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll(user_id: string, question_id: string) {
    try {
      const answers = await this.answersService.getAll(user_id, question_id);
      return answers.map((answer) => plainToClass(ResponseAnswersDto, answer));
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getById(user_id: string, question_id: string, id: string) {
    try {
      const answer = await this.answersService.getById(
        user_id,
        question_id,
        id,
      );
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
    user_id: string,
    question_id: string,
    id: string,
    updateAnswerDto: UpdateAnswerDto,
  ) {
    try {
      const answer = await this.answersService.updateById(
        user_id,
        question_id,
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

  async deleteById(user_id: string, question_id: string, id: string) {
    try {
      await this.answersService.deleteById(user_id, question_id, id);
    } catch (error) {
      if (error instanceof AnswerError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
