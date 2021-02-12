import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionService } from '../question/question.service';
import { Answers } from './entities/answers.entity';

@Injectable()
export class AnswersService {
  constructor(
    private readonly questionService: QuestionService,

    @InjectRepository(Answers)
    private answersRepository: Repository<Answers>,
  ) {}

  async create(user_id, question_id, createAnswerDto) {
    try {
      // check if user has this question
      const question = await this.questionService.findOne(user_id, question_id);
      // answer record
      const answer = await this.answersRepository.create({
        ...createAnswerDto,
        questions: question,
      });
      await this.answersRepository.save(answer);

      return answer;
    } catch (error) {
      throw error;
    }
  }
}
