import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AnswerError } from '../errors/answers.error';
import { CreateAnswersDto } from '../dto/create-answers.dto';
import { UpdateAnswersDto } from '../dto/update-answers.dto';
import { Answers } from '../entities/answers.entity';
import { Questions } from '../entities/questions.entity';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answers)
    private answersRepository: Repository<Answers>,
  ) {}

  async create(question: Questions, createAnswerDto: CreateAnswersDto) {
    try {
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

  async getAll(question: Questions) {
    try {
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

  async getById(question: Questions, id: string) {
    try {
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
    question: Questions,
    id: string,
    updateAnswerDto: UpdateAnswersDto,
  ) {
    try {
      const answer = await this.getById(question, id);
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

  async deleteById(question: Questions, id: string) {
    try {
      const answer = await this.getById(question, id);
      await this.answersRepository.softDelete({
        id: answer.id,
      });
      return answer;
    } catch (error) {
      throw error;
    }
  }
}
