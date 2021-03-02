import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { FoldersError } from '../folders/folders.error';
import { QuestionError } from '../question/question.error';
import { CreateTestDto } from './dto/create-test.dto';
import { ResponseTestDto } from './dto/response-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { TestError } from './test.error';
import { TestService } from './test.service';

@Injectable()
export class TestHttpService {
  constructor(private readonly testService: TestService) {}
  async create(user_id: string, createTestDto: CreateTestDto) {
    try {
      const test = await this.testService.create(user_id, createTestDto);

      const responseQuestion = plainToClass(ResponseTestDto, test);
      return responseQuestion;
    } catch (error) {
      if (
        error instanceof TestError ||
        error instanceof FoldersError ||
        error instanceof QuestionError
      )
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getAll() {
    return `This action returns all test`;
  }

  getOne(id: string) {
    return `This action returns a #${id} test`;
  }

  updateById(id: string, updateTestDto: UpdateTestDto) {
    return `This action updates a #${id} test`;
  }

  deleteById(id: string) {
    return `This action removes a #${id} test`;
  }
}
