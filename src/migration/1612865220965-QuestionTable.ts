import { MigrationInterface, QueryRunner } from 'typeorm';

export class QuestionTable1612865220965 implements MigrationInterface {
  name = 'QuestionTable1612865220965';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "questions_template_enum" AS ENUM('boolean')`,
    );
    await queryRunner.query(
      `CREATE TYPE "questions_answer_type_enum" AS ENUM('button', 'user_input')`,
    );
    await queryRunner.query(
      `CREATE TABLE "questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "text" character varying NOT NULL, "time" integer NOT NULL, "template" "questions_template_enum" NOT NULL, "answer_type" "questions_answer_type_enum" NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "questions"`);
    await queryRunner.query(`DROP TYPE "questions_answer_type_enum"`);
    await queryRunner.query(`DROP TYPE "questions_template_enum"`);
  }
}
