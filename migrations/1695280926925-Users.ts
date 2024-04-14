import { MigrationInterface, QueryRunner } from "typeorm"

export class Users1695280926925 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                            CREATE TABLE public."user" (
                                "id" SERIAL PRIMARY KEY,
                                "name" VARCHAR(255) NOT NULL,
                                "email" VARCHAR(255) NOT NULL,
                                "password" VARCHAR(255) NOT NULL,
                                "isActive" BOOLEAN DEFAULT TRUE,
                                "isLogin" BOOLEAN DEFAULT FALSE,
                                "roleId" INT,
                                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "deletedAt" TIMESTAMP,
                                FOREIGN KEY ("roleId") REFERENCES public."role"(id) ON DELETE SET NULL
                            );
                        `;
        await queryRunner.query(command);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `DROP TABLE IF EXISTS public."user";`
        await queryRunner.query(command);
    }

}
