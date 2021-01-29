import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UserTable1611932277003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'e-mail',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'name',
            length: '255',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'hash',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
        ],
      }),
      false,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE users;');
  }
}
