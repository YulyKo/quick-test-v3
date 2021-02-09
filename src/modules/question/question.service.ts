import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Questions } from './entities/question.entity';
import { Answers } from './entities/answers.entity';
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

      // answer records
      const answers = await this.answersRepository.create(
        createQuestionDto.answers,
      );
      await this.answersRepository.save(answers);

      // question record
      const question = await this.questionRepository.create({
        ...createQuestionDto,
        answers,
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

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
