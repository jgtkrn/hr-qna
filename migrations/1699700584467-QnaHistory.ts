import { MigrationInterface, QueryRunner } from "typeorm"

export class QnaHistory1699700584467 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                            CREATE TABLE public."qna_history" (
                                "id" SERIAL PRIMARY KEY,
                                "answer" TEXT,
                                "key" TEXT,
                                "type" VARCHAR(255),
                                "isCorrect" BOOLEAN DEFAULT FALSE,
                                "testId" INT NOT NULL,
                                "activityId" INT NOT NULL,
                                "qnaId" INT NOT NULL,
                                "participantId" INT NOT NULL,
                                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "deletedAt" TIMESTAMP,
                                FOREIGN KEY ("activityId") REFERENCES public."activity"(id) ON DELETE SET NULL,
                                FOREIGN KEY ("qnaId") REFERENCES public."qna"(id) ON DELETE SET NULL,
                                FOREIGN KEY ("testId") REFERENCES public."test"(id) ON DELETE SET NULL,
                                FOREIGN KEY ("participantId") REFERENCES public."participant"(id) ON DELETE CASCADE
                            );
                        `;
        await queryRunner.query(command);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `DROP TABLE IF EXISTS public."qna_history";`
        await queryRunner.query(command);
    }

}
