import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuestionService } from '../question/question.service';
import { AnswerError } from './answers.error';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Answers } from './entities/answers.entity';

@Injectable()
export class AnswersService {
  constructor(
    private readonly questionService: QuestionService,

    @InjectRepository(Answers)
    private answersRepository: Repository<Answers>,
  ) {}

  async create(
    user_id: string,
    question_id: string,
    createAnswerDto: CreateAnswerDto,
  ) {
    try {
      const question = await this.questionService.getById(user_id, question_id);
      const answer = await this.answersRepository.create({
        ...createAnswerDto,
        question,
      });
      await this.answersRepository.save(answer);

      return answer;
    } catch (error) {
      throw error;
    }
  }

  async getAll(user_id: string, question_id: string) {
    try {
      const question = await this.questionService.getById(user_id, question_id);
      const answers = await this.answersRepository.find({
        where: {
          question,
        },
      });
      return answers;
    } catch (error) {
      throw error;
    }
  }

  async getById(user_id: string, question_id: string, id: string) {
    try {
      const question = await this.questionService.getById(user_id, question_id);
      const answer = await this.answersRepository.findOne({
        where: {
          question,
          id,
        },
      });
      if (!answer)
        throw new AnswerError('question does not have answer with this id');
      return answer;
    } catch (error) {
      throw error;
    }
  }

  async updateById(
    user_id: string,
    question_id: string,
    id: string,
    updateAnswerDto: UpdateAnswerDto,
  ) {
    try {
      const answer = await this.getById(user_id, question_id, id);
      const updatedAnswer = {
        ...answer,
        ...updateAnswerDto,
      };
      await this.answersRepository.save(updatedAnswer);
      return updatedAnswer;
    } catch (error) {
      throw error;
    }
  }

  async deleteById(user_id: string, question_id: string, id: string) {
    try {
      const answer = await this.getById(user_id, question_id, id);
      await this.answersRepository.softDelete({
        id: answer.id,
      });
      return answer;
    } catch (error) {
      throw error;
    }
  }
}
