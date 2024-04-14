import { MigrationInterface, QueryRunner } from "typeorm"

export class Qna1697423284897 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                            CREATE TABLE public."qna" (
                                "id" SERIAL PRIMARY KEY,
                                "question" TEXT,
                                "answers" TEXT,
                                "key" TEXT,
                                "type" VARCHAR(255),
                                "isActive" BOOLEAN DEFAULT TRUE,
                                "testId" INT NOT NULL,
                                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "deletedAt" TIMESTAMP,
                                UNIQUE ("testId"),
                                FOREIGN KEY ("testId") REFERENCES public."test"(id) ON DELETE CASCADE
                            );
                        `;
        await queryRunner.query(command);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `DROP TABLE IF EXISTS public."qna";`
        await queryRunner.query(command);
    }

}
