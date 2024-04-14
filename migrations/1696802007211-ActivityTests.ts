import { MigrationInterface, QueryRunner } from "typeorm"

export class ActivityTests1696802007211 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                            CREATE TABLE public."activity_test" (
                                "id" SERIAL PRIMARY KEY,
                                "activityId" INT,
                                "testId" INT,
                                "order" INTEGER,
                                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "deletedAt" TIMESTAMP,
                                FOREIGN KEY ("activityId") REFERENCES public."activity"(id) ON DELETE SET NULL,
                                FOREIGN KEY ("testId") REFERENCES public."test"(id) ON DELETE SET NULL
                            );
                        `;
         await queryRunner.query(command);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `DROP TABLE IF EXISTS public."activity_test";`
        await queryRunner.query(command);
    }

}
