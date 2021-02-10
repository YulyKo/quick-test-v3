import { Controller, Get, Param } from '@nestjs/common';
import { GetUser } from '../auth/get-user.decorator';

@Controller('question/:questionId/answers')
export class AnswersController {

  constructor( 
    private readonly questionService: QuestionService
   ){}

  @Get()
  findAll(@GetUser() user, @Param('questionId') question_id: string) {
    return 'ok';
  }
}
