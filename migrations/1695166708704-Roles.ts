import { MigrationInterface, QueryRunner } from "typeorm"

export class Roles1695166708704 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                            CREATE TABLE public.role (
                                "id" SERIAL PRIMARY KEY,
                                "name" VARCHAR(255),
                                "isActive" BOOLEAN DEFAULT TRUE,
                                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
                                "deletedAt" TIMESTAMP
                            );
                        `;
        await queryRunner.query(command);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `DROP TABLE IF EXISTS public."role";`
        await queryRunner.query(command);
    }

}
