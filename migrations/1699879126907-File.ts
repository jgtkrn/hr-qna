import { MigrationInterface, QueryRunner } from "typeorm"

export class File1699879126907 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                            CREATE TABLE public."file" (
                                "id" SERIAL PRIMARY KEY,
                                "filename" TEXT,
                                "extension" VARCHAR(255),
                                "size" INT NOT NULL DEFAULT 0,
                                "url" TEXT,
                                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "deletedAt" TIMESTAMP
                            );
                        `;
        await queryRunner.query(command);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `DROP TABLE IF EXISTS public."file";`
        await queryRunner.query(command);
    }

}
