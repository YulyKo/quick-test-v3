import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FoldersService } from '../folders/folders.service';
import { QuestionService } from '../question/question.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test } from './entities/test.entity';
import { config } from '../../config';

@Injectable()
export class TestService {
  constructor(
    private readonly folderService: FoldersService,
    private readonly questionService: QuestionService,

    @InjectRepository(Test)
    private testRepository: Repository<Test>,
  ) {}

  async create(user_id: string, createTestDto: CreateTestDto) {
    const questions = await this.questionService.getByIds(
      user_id,
      createTestDto.questions,
    );

    const folder = await this.folderService.getById(
      user_id,
      createTestDto.folder_id || user_id,
    );

    const code = await this.generateCode();
    const test = this.testRepository.create({
      ...createTestDto,
      code,
      questions,
      folder,
      user: {
        id: user_id,
      },
    });

    await this.testRepository.save(test);
    return test;
  }

  findAll() {
    return `This action returns all test`;
  }

  findOne(id: number) {
    return `This action returns a #${id} test`;
  }

  update(id: number, updateTestDto: UpdateTestDto) {
    return `This action updates a #${id} test`;
  }

  remove(id: number) {
    return `This action removes a #${id} test`;
  }

  generateCode() {
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
}
