import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FoldersError } from '../folders/folders.error';

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionError } from './question.error';
import { QuestionService } from './question.service';

@Injectable()
export class QuestionHttpService {
  constructor(private readonly questionService: QuestionService) {}

  async create(user_id: string, createQuestionDto: CreateQuestionDto) {
    try {
      const question = await this.questionService.create(
        user_id,
        createQuestionDto,
      );

      return {
        id: question.id,
        created: question.created,
        message: 'question successfully created',
      };
    } catch (error) {
      if (error instanceof QuestionError || error instanceof FoldersError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll(user_id: string) {
    try {
      const questions = await this.questionService.getAll(user_id);
      return questions;
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getById(user_id: string, id: string) {
    try {
      const question = await this.questionService.getById(user_id, id);
      return question;
    } catch (error) {
      if (error instanceof QuestionError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    user_id: string,
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ) {
    try {
      const question = await this.questionService.update(
        user_id,
        id,
        updateQuestionDto,
      );
      return {
        id: question.id,
        updated: question.updated,
        message: 'question successfully updated',
      };
    } catch (error) {
      if (error instanceof QuestionError)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteById(user_id: string, id: string) {
    try {
      const question = await this.questionService.remove(user_id, id);
      return {
        id: question.id,
        message: 'question successfully deleted',
      };
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
