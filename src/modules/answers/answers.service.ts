import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuestionsService } from '../questions/questions.service';
import { AnswerError } from './answers.error';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Answers } from './entities/answers.entity';

@Injectable()
export class AnswersService {
  constructor(
    private readonly questionService: QuestionsService,

    @InjectRepository(Answers)
    private answersRepository: Repository<Answers>,
  ) {}

  async create(
    userId: string,
    questionId: string,
    createAnswerDto: CreateAnswerDto,
  ) {
    try {
      const question = await this.questionService.getById(userId, questionId);
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

  async getAll(userId: string, questionId: string) {
    try {
      const question = await this.questionService.getById(userId, questionId);
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

  async getById(userId: string, questionId: string, id: string) {
    try {
      const question = await this.questionService.getById(userId, questionId);
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
    userId: string,
    questionId: string,
    id: string,
    updateAnswerDto: UpdateAnswerDto,
  ) {
    try {
      const answer = await this.getById(userId, questionId, id);
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

  async deleteById(userId: string, questionId: string, id: string) {
    try {
      const answer = await this.getById(userId, questionId, id);
      await this.answersRepository.softDelete({
        id: answer.id,
      });
      return answer;
    } catch (error) {
      throw error;
    }
  }
}
