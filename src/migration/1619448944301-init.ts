import {MigrationInterface, QueryRunner} from "typeorm";

export class init1619448944301 implements MigrationInterface {
    name = 'init1619448944301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "isOpen" SET DEFAULT 'FALSE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "isOpen" SET DEFAULT false`);
    }

}
