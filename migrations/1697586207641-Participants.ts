import { MigrationInterface, QueryRunner } from "typeorm"

export class Participants1697586207641 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                            CREATE TABLE public."participant" (
                                "id" SERIAL PRIMARY KEY,
                                "name" VARCHAR(255) NOT NULL,
                                "email" VARCHAR(255) NOT NULL,
                                "password" VARCHAR(255) NOT NULL,
                                "participantId" VARCHAR(255) NOT NULL,
                                "participantCode" VARCHAR(255) NOT NULL,
                                "isActive" BOOLEAN DEFAULT TRUE,
                                "isLogin" BOOLEAN DEFAULT FALSE,
                                "activityId" INT,
                                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "deletedAt" TIMESTAMP,
                                FOREIGN KEY ("activityId") REFERENCES public."activity"(id) ON DELETE CASCADE
                            );
                        `;
        await queryRunner.query(command);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `DROP TABLE IF EXISTS public."user";`
        await queryRunner.query(command);
    }

}
