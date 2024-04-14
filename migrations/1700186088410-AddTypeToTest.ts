import { MigrationInterface, QueryRunner } from "typeorm"

export class AddTypeToTest1700186088410 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                    ALTER TABLE public."test"
                    ADD COLUMN "type" VARCHAR(255);
                `;
         await queryRunner.query(command);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                    ALTER TABLE public."test"
                    ADD COLUMN "type";
                `;
         await queryRunner.query(command);
    }
}
