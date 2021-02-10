import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Questions } from './entities/question.entity';
import { Answers } from '../answers/entities/answers.entity';
import { Users } from '../user/entities/user.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Questions)
    private questionRepository: Repository<Questions>,

    @InjectRepository(Answers)
    private answersRepository: Repository<Answers>,

    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async create(user_id: string, createQuestionDto: CreateQuestionDto) {
    try {
      const user = await this.userRepository.findOne({
        id: user_id,
      });

      // question record
      const question = await this.questionRepository.create({
        ...createQuestionDto,
        user,
      });
      await this.questionRepository.save(question);

      return {
        message: 'question successfully created',
        id: question.id,
        created: question.created.getTime(),
        updated: question.updated.getTime(),
      };
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(user_id: string) {
    try {
      const user = await this.userRepository.findOne({
        id: user_id,
      });

      const questions = await this.questionRepository.find({
        where: {
          user,
        },
        relations: ['answers'],
      });
      return questions;
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(user_id: string, id: string) {
    try {
      const user = await this.userRepository.findOne({
        id: user_id,
      });

      const question = await this.questionRepository.find({
        where: {
          id,
          user,
        },
        relations: ['answers'],
      });
      return question;
    } catch (error) {
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
      const user = await this.userRepository.findOne({
        id: user_id,
      });

      const question = await this.questionRepository.findOne({
        id,
        user,
      });

      if (!question)
        throw new HttpException(
          'user does not have question with this id',
          HttpStatus.BAD_REQUEST,
        );

      await this.questionRepository.save({ ...updateQuestionDto, id });
      return {
        message: 'question successfully updated',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
