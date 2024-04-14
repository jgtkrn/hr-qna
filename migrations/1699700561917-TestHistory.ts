import { MigrationInterface, QueryRunner } from "typeorm"

export class TestHistory1699700561917 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                            CREATE TABLE public."test_history" (
                                "id" SERIAL PRIMARY KEY,
                                "status" VARCHAR(255),
                                "type" VARCHAR(255),
                                "startTime" TIMESTAMP,
                                "endTime" TIMESTAMP,
                                "questionAnswered" INT,
                                "questionNotAnswered" INT,
                                "answerCorrect" INT,
                                "answerIncorrect" INT,
                                "percentage" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
                                "duration" INT,
                                "isActive" BOOLEAN DEFAULT TRUE,
                                "activityId" INT NOT NULL,
                                "testId" INT NOT NULL,
                                "participantId" INT NOT NULL,
                                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "deletedAt" TIMESTAMP,
                                FOREIGN KEY ("activityId") REFERENCES public."activity"(id) ON DELETE SET NULL,
                                FOREIGN KEY ("testId") REFERENCES public."test"(id) ON DELETE SET NULL,
                                FOREIGN KEY ("participantId") REFERENCES public."participant"(id) ON DELETE CASCADE
                            );
                        `;
        await queryRunner.query(command);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `DROP TABLE IF EXISTS public."test_history";`
        await queryRunner.query(command);
    }

}
