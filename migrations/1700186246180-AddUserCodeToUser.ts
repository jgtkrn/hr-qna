import { MigrationInterface, QueryRunner } from "typeorm"

export class AddUserCodeToUser1700186246180 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                    ALTER TABLE public."user"
                    ADD COLUMN "userId" TEXT;
                `;
         await queryRunner.query(command);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                    ALTER TABLE public."user"
                    ADD COLUMN "userId";
                `;
         await queryRunner.query(command);
    }

}
