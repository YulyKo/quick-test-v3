import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { FoldersError } from '../folders/folders.error';
import { QuestionsError } from '../questions/questions.error';
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
        error instanceof QuestionsError
      )
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll(user_id: string) {
    try {
      const tests = await this.testService.getAll(user_id);

      return tests.map((test) => plainToClass(ResponseTestDto, test));
    } catch (error) {
      if (
        error instanceof TestError ||
        error instanceof FoldersError ||
        error instanceof QuestionsError
      )
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOne(user_id: string, id: string) {
    try {
      const test = await this.testService.getById(user_id, id);

      return plainToClass(ResponseTestDto, test);
    } catch (error) {
      if (
        error instanceof TestError ||
        error instanceof FoldersError ||
        error instanceof QuestionsError
      )
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateById(user_id: string, id: string, updateTestDto: UpdateTestDto) {
    try {
      const test = await this.testService.updateById(
        user_id,
        id,
        updateTestDto,
      );

      return plainToClass(ResponseTestDto, test);
    } catch (error) {
      if (
        error instanceof TestError ||
        error instanceof FoldersError ||
        error instanceof QuestionsError
      )
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addQuestion(userId: string, testId: string, questionId: string) {
    try {
      const test = await this.testService.addQuestion(
        userId,
        testId,
        questionId,
      );

      return plainToClass(ResponseTestDto, test);
    } catch (error) {
      if (
        error instanceof TestError ||
        error instanceof FoldersError ||
        error instanceof QuestionsError
      )
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeQuestion(userId: string, testId: string, questionId: string) {
    try {
      const test = await this.testService.removeQuestion(
        userId,
        testId,
        questionId,
      );

      return plainToClass(ResponseTestDto, test);
    } catch (error) {
      if (
        error instanceof TestError ||
        error instanceof FoldersError ||
        error instanceof QuestionsError
      )
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteById(user_id: string, id: string) {
    try {
      await this.testService.deleteById(user_id, id);
    } catch (error) {
      if (
        error instanceof TestError ||
        error instanceof FoldersError ||
        error instanceof QuestionsError
      )
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
