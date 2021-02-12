import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';

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
}
