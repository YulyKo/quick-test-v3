import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { QuestionError } from '../question/question.error';
import { AnswerError } from './answers.error';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
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

      return {
        id: answer.id,
        created: answer.created,
        message: 'answer successfully created',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll(user_id: string, question_id: string) {
    try {
      const answers = await this.answersService.getAll(user_id, question_id);
      return answers;
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
      return answer;
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
      const asnwer = await this.answersService.updateById(
        user_id,
        question_id,
        id,
        updateAnswerDto,
      );
      return {
        id: asnwer.id,
        updated: asnwer.updated,
        message: 'answer successfully updated',
      };
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
      const answer = await this.answersService.deleteById(
        user_id,
        question_id,
        id,
      );
      return {
        id: answer.id,
        message: 'answer successfully deleted',
      };
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
