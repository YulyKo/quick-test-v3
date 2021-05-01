import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { FoldersError } from '../folders/folders.error';
import { QuestionsError } from '../questions/errors/questions.error';
import { CreateTestsDto } from './dto/create-tests.dto';
import { ResponseTestsDto } from './dto/response-tests.dto';
import { UpdateTestsDto } from './dto/update-tests.dto';
import { TestError } from './tests.error';
import { TestsService } from './tests.service';
import { LoggerService } from '../../utils/logger.service';

@Injectable()
export class TestsHttpService {
  logger = new LoggerService(TestsHttpService.name);

  constructor(private readonly testsService: TestsService) {}
  async create(userId: string, createTestDto: CreateTestsDto) {
    try {
      const test = await this.testsService.create(userId, createTestDto);

      const responseQuestion = plainToClass(ResponseTestsDto, test);
      this.logger.debug(
        `Test created, with id: ${test.id}, for user ${userId}`,
        this.create.name,
      );
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

  async getAll(userId: string) {
    try {
      const tests = await this.testsService.getAll(userId);

      return tests.map((test) => plainToClass(ResponseTestsDto, test));
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

  async getOne(userId: string, id: string) {
    try {
      const test = await this.testsService.getById(userId, id);

      return plainToClass(ResponseTestsDto, test);
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

  async updateById(userId: string, id: string, updateTestDto: UpdateTestsDto) {
    try {
      const test = await this.testsService.updateById(
        userId,
        id,
        updateTestDto,
      );
      this.logger.debug(
        `Test updated, with id: ${id}, for user ${userId}`,
        this.updateById.name,
      );
      return plainToClass(ResponseTestsDto, test);
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
      const test = await this.testsService.addQuestion(
        userId,
        testId,
        questionId,
      );
      this.logger.debug(
        `Question added, with id: ${questionId}, to test ${testId}, for user ${userId}`,
        this.addQuestion.name,
      );
      return plainToClass(ResponseTestsDto, test);
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
      const test = await this.testsService.removeQuestion(
        userId,
        testId,
        questionId,
      );
      this.logger.debug(
        `Question removed, with id: ${questionId}, from test ${testId}, for user ${userId}`,
        this.removeQuestion.name,
      );
      return plainToClass(ResponseTestsDto, test);
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

  async deleteById(userId: string, id: string) {
    try {
      await this.testsService.deleteById(userId, id);
      this.logger.debug(
        `Test deleted, with id: ${id}, for user ${userId}`,
        this.addQuestion.name,
      );
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
