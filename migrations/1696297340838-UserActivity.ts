import { MigrationInterface, QueryRunner } from "typeorm"

export class UserActivity1696297340838 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `
                            CREATE TABLE public."user_activities_activity" (
                                "userId" INT,
                                "activityId" INT,
                                PRIMARY KEY ("userId", "activityId"),
                                FOREIGN KEY ("userId") REFERENCES public."user"("id") ON DELETE SET NULL,
                                FOREIGN KEY ("activityId") REFERENCES public.activity("id") ON DELETE SET NULL
                            );
                        `;
        await queryRunner.query(command);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `DROP TABLE IF EXISTS public."user_activities_activity";`
        await queryRunner.query(command);
    }

}
