import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Questions } from './question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Questions)
    private questionRepository: Repository<Questions>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    try {
      const question = await this.questionRepository.create(createQuestionDto);
      await this.questionRepository.save(question);
      return {
        message: 'question successfully created',
        id: question.id,
        // created: question.created,
        // updated: question.updated,
      };
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all question`;
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
