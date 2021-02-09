import { MigrationInterface, QueryRunner } from 'typeorm';

export class AnswerTable1612865270619 implements MigrationInterface {
  name = 'AnswerTable1612865270619';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "is_true" boolean NOT NULL, CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "questions"."created" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "questions"."updated" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "questions"."updated" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "questions"."created" IS NULL`);
    await queryRunner.query(`DROP TABLE "answers"`);
  }
}
