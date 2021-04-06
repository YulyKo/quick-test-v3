import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FoldersService } from '../folders/folders.service';
import { QuestionsService } from '../questions/questions.service';
import { CodeService } from '../code/code.service';
import { CreateTestsDto } from './dto/create-tests.dto';
import { UpdateTestsDto } from './dto/update-tests.dto';
import { Tests } from './entities/tests.entity';
import { Questions } from '../questions/entities/questions.entity';
import { TestError } from './tests.error';

@Injectable()
export class TestsService {
  constructor(
    private readonly foldersService: FoldersService,
    private readonly questionsService: QuestionsService,
    private readonly codeService: CodeService,

    @InjectRepository(Tests)
    private testsRepository: Repository<Tests>,
  ) {}

  async create(userId: string, createTestsDto: CreateTestsDto) {
    const folder = await this.foldersService.getById(
      userId,
      createTestsDto.folderId || userId,
    );

    const code = await this.getUniqCode();
    let questions = [];

    if (createTestsDto.questions) {
      questions = await this.questionsService.getByIds(
        userId,
        createTestsDto.questions,
      );
    }

    const test = this.testsRepository.create({
      ...createTestsDto,
      code,
      folder,
      questions,
      user: {
        id: userId,
      },
    });

    await this.testsRepository.save(test);
    return test;
  }

  async getAll(userId: string) {
    const tests = await this.testsRepository
      .createQueryBuilder('tests')
      .where({ user: userId })
      .leftJoin('tests.folder', 'folder')
      .addSelect(['folder.id'])
      .leftJoinAndSelect('tests.questions', 'questions')
      .leftJoin('questions.folder', 'question_folder')
      .addSelect(['question_folder.id'])
      .leftJoinAndSelect('questions.answers', 'answers')
      .getMany();

    return tests;
  }

  async getById(userId: string, id: string) {
    const test = await this.testsRepository
      .createQueryBuilder('tests')
      .where({ user: userId, id })
      .leftJoin('tests.folder', 'folder')
      .addSelect(['folder.id'])
      .leftJoinAndSelect('tests.questions', 'questions')
      .leftJoin('questions.folder', 'question_folder')
      .addSelect(['question_folder.id'])
      .leftJoinAndSelect('questions.answers', 'answers')
      .getOne();

    return test;
  }

  async updateById(userId: string, id: string, updateTestDto: UpdateTestsDto) {
    const test = await this.getById(userId, id);

    const newTest = { ...test, updateTestDto };
    if (updateTestDto.folderId) {
      const newFolder = await this.foldersService.getById(
        userId,
        updateTestDto.folderId,
      );
      newTest.folder = newFolder;
    }

    await this.testsRepository.save(newTest);
    return newTest;
  }

  async addQuestion(userId: string, testId: string, questionId: string) {
    const question = await this.questionsService.getById(userId, questionId);
    const test = await this.getById(userId, testId);

    const questionIndex = this.hasTestQuestion(test.questions, questionId);
    if (questionIndex !== -1)
      throw new TestError(
        `This test has already had question with id: ${questionId}`,
      );
    test.questions.push(question);
    await this.testsRepository.save(test);
    return test;
  }

  async removeQuestion(userId: string, testId: string, questionId: string) {
    const question = await this.questionsService.getById(userId, questionId);
    const test = await this.getById(userId, testId);

    const questionIndex = this.hasTestQuestion(test.questions, question.id);
    if (questionIndex === -1)
      throw new TestError(
        `This test does not have question with id: ${question.id}`,
      );

    test.questions.splice(questionIndex, 1);
    await this.testsRepository.save(test);
    return test;
  }

  async deleteById(userId: string, id: string) {
    const test = await this.getById(userId, id);
    await this.testsRepository.softRemove(test);
  }

  private hasTestQuestion(questions: Questions[], questionId: string) {
    const index = questions.findIndex((question) => question.id === questionId);
    return index;
  }

  private async isUniqCode(code: string) {
    const codeFromDB = await this.testsRepository.findOne({ code });
    return !codeFromDB;
  }

  private async getUniqCode() {
    let code;
    let isUniq;
    do {
      code = this.codeService.generateCode();
      isUniq = await this.isUniqCode(code);
    } while (!isUniq);
    return code;
  }
}
