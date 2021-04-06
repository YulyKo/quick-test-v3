import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { AnswerError } from '../answers/answers.error';
import { AnswersService } from '../answers/answers.service';
import { FoldersError } from '../folders/folders.error';
import { CreateQuestionsDto } from './dto/create-questions.dto';
import { ResponseQuestionsDto } from './dto/response-questions.dto';
import { UpdateQuestionsDto } from './dto/update-questions.dto';
import { QuestionsError } from './questions.error';
import { QuestionsService } from './questions.service';

@Injectable()
export class QuestionsHttpService {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly answerService: AnswersService,
  ) {}

  async create(userId: string, createQuestionsDtos: CreateQuestionsDto[]) {
    try {
      const questions = await Promise.all(
        createQuestionsDtos.map(async (createQuestionsDto) => {
          const question = await this.questionsService.create(
            userId,
            createQuestionsDto,
          );
          // if (createQuestionsDto.questionAnswers) {
          //   const answers = await Promise.all(
          //     createQuestionsDto.questionAnswers.map((answerDto) =>
          //       this.answerService.create(userId, question.id, answerDto),
          //     ),
          //   );
          //   question.answers = answers;
          // }
          return question;
        }),
      );

      return questions.map((question) =>
        plainToClass(ResponseQuestionsDto, question),
      );
    } catch (error) {
      if (
        error instanceof QuestionsError ||
        error instanceof FoldersError ||
        error instanceof AnswerError
      )
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
