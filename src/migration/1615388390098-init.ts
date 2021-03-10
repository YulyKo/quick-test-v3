import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1615388390098 implements MigrationInterface {
  name = 'init1615388390098';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "test" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "text" character varying NOT NULL, "code" character varying(6) NOT NULL, "is_open" boolean NOT NULL DEFAULT 'FALSE', "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "userId" uuid, "folderId" uuid, CONSTRAINT "PK_5417af0062cf987495b611b59c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "folders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "color" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "parentId" uuid, "userId" uuid, CONSTRAINT "PK_8578bd31b0e7f6d6c2480dbbca8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying NOT NULL, "hash" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "questions_template_enum" AS ENUM('boolean')`,
    );
    await queryRunner.query(
      `CREATE TYPE "questions_answertype_enum" AS ENUM('button', 'userInput')`,
    );
    await queryRunner.query(
      `CREATE TABLE "questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "text" character varying NOT NULL, "time" integer NOT NULL, "template" "questions_template_enum" NOT NULL, "answerType" "questions_answertype_enum" NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "userId" uuid, "folderId" uuid, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "isTrue" boolean NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "questionId" uuid, CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "test_questions_questions" ("testId" uuid NOT NULL, "questionsId" uuid NOT NULL, CONSTRAINT "PK_d1deb699b189c1a2009cb864684" PRIMARY KEY ("testId", "questionsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_80942d30d72b7c1f1b4ee5442f" ON "test_questions_questions" ("testId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eec101181752c792bc3c326b9f" ON "test_questions_questions" ("questionsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "test" ADD CONSTRAINT "FK_394889f330e608a61edd1163cdf" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" ADD CONSTRAINT "FK_0553e0c9af924579f1825a1987e" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "folders" ADD CONSTRAINT "FK_1be2fce400dcc657602d336f23f" FOREIGN KEY ("parentId") REFERENCES "folders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "folders" ADD CONSTRAINT "FK_5caa05c855e82b975c8c438cf68" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_bc2370231ea3e3d296963f33939" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_e725ad9633de2e49b2525ea4b79" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" ADD CONSTRAINT "FK_c38697a57844f52584abdb878d7" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_questions_questions" ADD CONSTRAINT "FK_80942d30d72b7c1f1b4ee5442fb" FOREIGN KEY ("testId") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_questions_questions" ADD CONSTRAINT "FK_eec101181752c792bc3c326b9f8" FOREIGN KEY ("questionsId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test_questions_questions" DROP CONSTRAINT "FK_eec101181752c792bc3c326b9f8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_questions_questions" DROP CONSTRAINT "FK_80942d30d72b7c1f1b4ee5442fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" DROP CONSTRAINT "FK_c38697a57844f52584abdb878d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_e725ad9633de2e49b2525ea4b79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_bc2370231ea3e3d296963f33939"`,
    );
    await queryRunner.query(
      `ALTER TABLE "folders" DROP CONSTRAINT "FK_5caa05c855e82b975c8c438cf68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "folders" DROP CONSTRAINT "FK_1be2fce400dcc657602d336f23f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" DROP CONSTRAINT "FK_0553e0c9af924579f1825a1987e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" DROP CONSTRAINT "FK_394889f330e608a61edd1163cdf"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_eec101181752c792bc3c326b9f"`);
    await queryRunner.query(`DROP INDEX "IDX_80942d30d72b7c1f1b4ee5442f"`);
    await queryRunner.query(`DROP TABLE "test_questions_questions"`);
    await queryRunner.query(`DROP TABLE "answers"`);
    await queryRunner.query(`DROP TABLE "questions"`);
    await queryRunner.query(`DROP TYPE "questions_answertype_enum"`);
    await queryRunner.query(`DROP TYPE "questions_template_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "folders"`);
    await queryRunner.query(`DROP TABLE "test"`);
  }
}
