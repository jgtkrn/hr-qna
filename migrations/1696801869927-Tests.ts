import { MigrationInterface, QueryRunner } from "typeorm"

export class Tests1696801869927 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                            CREATE TABLE public."test" (
                                "id" SERIAL PRIMARY KEY,
                                "name" VARCHAR(255),
                                "isActive" BOOLEAN DEFAULT true,
                                "description" TEXT,
                                "token" INTEGER,
                                "status" VARCHAR(255),
                                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "deletedAt" TIMESTAMP
                            );
                        `;
         await queryRunner.query(command);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `DROP TABLE IF EXISTS public."test";`
        await queryRunner.query(command);
    }

}
