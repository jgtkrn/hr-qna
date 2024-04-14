import { MigrationInterface, QueryRunner } from "typeorm"

export class Subscriptions1695475910400 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                            CREATE TABLE public."subscription" (
                                "id" SERIAL PRIMARY KEY,
                                "amount" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
                                "isActive" BOOLEAN DEFAULT TRUE,
                                "userId" INT NOT NULL,
                                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "deletedAt" TIMESTAMP,
                                UNIQUE ("userId"),
                                FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE
                            );
                        `;
        await queryRunner.query(command);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `DROP TABLE IF EXISTS public."subscription";`
        await queryRunner.query(command);
    }

}
