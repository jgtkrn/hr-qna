import { MigrationInterface, QueryRunner } from "typeorm"

export class RemoveUniqueFromQnA1698068726494 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `ALTER TABLE public."qna" DROP CONSTRAINT "qna_testId_key";`;
        await queryRunner.query(command);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `ALTER TABLE public."qna" ADD CONSTRAINT "qna_testId_key" UNIQUE ("testId");`;
        await queryRunner.query(command);
    }

}
