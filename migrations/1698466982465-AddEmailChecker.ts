import { MigrationInterface, QueryRunner } from "typeorm"

export class AddEmailChecker1698466982465 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                    ALTER TABLE public."participant"
                    ADD COLUMN "emailSent" BOOLEAN,
                    ADD COLUMN "emailSentLimit" INT;

                    ALTER TABLE public."user"
                    ADD COLUMN "emailSent" BOOLEAN,
                    ADD COLUMN "emailSentLimit" INT;
                `;
         await queryRunner.query(command);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                    ALTER TABLE public."participant"
                    ADD COLUMN "emailSent",
                    ADD COLUMN "emailSentLimit";
                    
                    ALTER TABLE public."user"
                    ADD COLUMN "emailSent",
                    ADD COLUMN "emailSentLimit";
                `;
         await queryRunner.query(command);
    }

}
