import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class QuestionsTable1612784353615 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await queryRunner.createTable(
      new Table({
        name: 'questions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'text',
            length: '255',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'time',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'template',
            length: '255',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'answer_type',
            length: '255',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'isDeleted',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'created',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'updated',
            type: 'timestamp',
            isNullable: false,
          },
        ],
      }),
      false,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE questions;');
  }
}
