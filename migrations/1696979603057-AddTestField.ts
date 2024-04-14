import { MigrationInterface, QueryRunner } from "typeorm"

export class AddTestField1696979603057 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                    ALTER TABLE public."test"
                    ADD COLUMN "duration" INT,
                    ADD COLUMN "thumbnail" TEXT;
                `;
         await queryRunner.query(command);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                    ALTER TABLE public."test"
                    ADD COLUMN "duration",
                    ADD COLUMN "thumbnail";
                `;
         await queryRunner.query(command);
    }

}
