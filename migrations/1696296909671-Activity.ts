import { MigrationInterface, QueryRunner } from "typeorm"

export class Activity1696296909671 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                            CREATE TABLE public."activity" (
                                "id" SERIAL PRIMARY KEY,
                                "name" VARCHAR(255),
                                "isActive" BOOLEAN DEFAULT true,
                                "startTime" TIMESTAMP,
                                "endTime" TIMESTAMP,
                                "description" TEXT,
                                "tokenPerUser" INTEGER,
                                "tokenMax" BIGINT,
                                "status" VARCHAR(255),
                                "isProctoring" BOOLEAN,
                                "createdBy" INTEGER,
                                "updatedBy" INTEGER,
                                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "deletedAt" TIMESTAMP
                            );
                        `;
         await queryRunner.query(command);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `DROP TABLE IF EXISTS public."activity";`
        await queryRunner.query(command);
    }

}
