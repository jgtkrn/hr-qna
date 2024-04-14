import { MigrationInterface, QueryRunner } from "typeorm"

export class SubsHistory1698452493480 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                            CREATE TABLE public."subscription_history" (
                                "id" SERIAL PRIMARY KEY,
                                "amount" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
                                "status" VARCHAR(255),
                                "isActive" BOOLEAN DEFAULT TRUE,
                                "userId" INT NOT NULL,
                                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "deletedAt" TIMESTAMP,
                                FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE
                            );
                        `;
        await queryRunner.query(command);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `DROP TABLE IF EXISTS public."subscription_history";`
        await queryRunner.query(command);
    }

}
