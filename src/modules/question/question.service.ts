import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Questions } from './entities/question.entity';
import { QuestionError } from './question.error';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Questions)
    private questionRepository: Repository<Questions>,
  ) {}

  async create(user_id: string, createQuestionDto: CreateQuestionDto) {
    try {
      // question record
      const question = await this.questionRepository.create({
        ...createQuestionDto,
        user: {
          id: user_id,
        },
      });
      await this.questionRepository.save(question);

      return question;
    } catch (error) {
      throw error;
    }
  }

  async findAll(user_id: string) {
    try {
      const questions = await this.questionRepository.find({
        where: {
          user: {
            id: user_id,
          },
        },
        relations: ['answers'],
      });
      return questions;
    } catch (error) {
      throw error;
    }
  }

  async findOne(user_id: string, id: string) {
    try {
      const question = await this.questionRepository.findOne({
        where: {
          id,
          user: {
            id: user_id,
          },
        },
        relations: ['answers'],
      });

      if (!question)
        throw new QuestionError('user does not have question with this id');

      return question;
    } catch (error) {
      throw error;
    }
  }

  async update(
    user_id: string,
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ) {
    try {
      const question = await this.findOne(user_id, id);
      const updatedQuestion = { ...question, ...updateQuestionDto };
      await this.questionRepository.save(updatedQuestion);
      return updatedQuestion;
    } catch (error) {
      throw error;
    }
  }

  async remove(user_id: string, id: string) {
    try {
      const question = await this.findOne(user_id, id);
      await this.questionRepository.softDelete({ id: question.id });
      return {
        id,
      };
    } catch (error) {
      throw error;
    }
  }
}
