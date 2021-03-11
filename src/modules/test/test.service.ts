import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FoldersService } from '../folders/folders.service';
import { QuestionService } from '../question/question.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test } from './entities/test.entity';
import { config } from '../../config';
import { Questions } from '../question/entities/question.entity';
import { TestError } from './test.error';

@Injectable()
export class TestService {
  constructor(
    private readonly folderService: FoldersService,
    private readonly questionService: QuestionService,

    @InjectRepository(Test)
    private testRepository: Repository<Test>,
  ) {}

  async create(user_id: string, createTestDto: CreateTestDto) {
    const folder = await this.folderService.getById(
      user_id,
      createTestDto.folder_id || user_id,
    );

    const code = await this.getUniqCode();
    let questions = [];

    if (createTestDto.questions) {
      questions = await this.questionService.getByIds(
        user_id,
        createTestDto.questions,
      );
    }

    const test = this.testRepository.create({
      ...createTestDto,
      code,
      folder,
      questions,
      user: {
        id: user_id,
      },
    });

    await this.testRepository.save(test);
    return test;
  }

  async getAll(user_id: string) {
    const tests = await this.testRepository
      .createQueryBuilder('test')
      .where({ user: user_id })
      .leftJoin('test.folder', 'folder')
      .addSelect(['folder.id'])
      .leftJoinAndSelect('test.questions', 'questions')
      .leftJoin('questions.folder', 'question_folder')
      .addSelect(['question_folder.id'])
      .leftJoinAndSelect('questions.answers', 'answers')
      .getMany();

    return tests;
  }

  async getById(user_id: string, id: string) {
    const test = await this.testRepository
      .createQueryBuilder('test')
      .where({ user: user_id, id })
      .leftJoin('test.folder', 'folder')
      .addSelect(['folder.id'])
      .leftJoinAndSelect('test.questions', 'questions')
      .leftJoin('questions.folder', 'question_folder')
      .addSelect(['question_folder.id'])
      .leftJoinAndSelect('questions.answers', 'answers')
      .getOne();

    return test;
  }

  async updateById(user_id: string, id: string, updateTestDto: UpdateTestDto) {
    const test = await this.getById(user_id, id);

    const newTest = { ...test, updateTestDto };
    if (updateTestDto.folder_id) {
      const newFolder = await this.folderService.getById(
        user_id,
        updateTestDto.folder_id,
      );
      newTest.folder = newFolder;
    }

    await this.testRepository.save(newTest);
    return newTest;
  }

  async addQuestion(userId: string, testId: string, questionId: string) {
    const question = await this.questionService.getById(userId, questionId);
    const test = await this.getById(userId, testId);

    const questionIndex = this.hasTestQuestion(test.questions, questionId);
    if (questionIndex !== -1)
      throw new TestError(
        `This test has already had question with id: ${questionId}`,
      );
    test.questions.push(question);
    await this.testRepository.save(test);
    return test;
  }

  async removeQuestion(userId: string, testId: string, questionId: string) {
    const question = await this.questionService.getById(userId, questionId);
    const test = await this.getById(userId, testId);

    const questionIndex = this.hasTestQuestion(test.questions, question.id);
    if (questionIndex === -1)
      throw new TestError(
        `This test does not have question with id: ${question.id}`,
      );

    test.questions.splice(questionIndex, 1);
    await this.testRepository.save(test);
    return test;
  }

  async deleteById(user_id: string, id: string) {
    const test = await this.getById(user_id, id);
    await this.testRepository.softRemove(test);
  }

  private hasTestQuestion(questions: Questions[], questionId: string) {
    const index = questions.findIndex((question) => question.id === questionId);
    return index;
  }

  private generateCode() {
    let code = '';
    for (let char = 0; char < config.constants.test.code.length; char++) {
      code += config.constants.test.code.characters.charAt(
        Math.round(
          0 - 0.5 + Math.random() * (config.constants.test.code.length - 0 + 1),
        ),
      );
    }
    return code;
  }

  private async isUniqCode(code: string) {
    const codeFromDB = await this.testRepository.findOne({ code });
    return !codeFromDB;
  }

  private async getUniqCode() {
    let code;
    let isUniq;
    do {
      code = this.generateCode();
      isUniq = await this.isUniqCode(code);
    } while (!isUniq);
    return code;
  }
}
