import { MigrationInterface, QueryRunner } from "typeorm"

export class RemoveNotNullParticipants1698284382250 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `ALTER TABLE public."participant"
                                    ALTER COLUMN "name" DROP NOT NULL,
                                    ALTER COLUMN "email" DROP NOT NULL,
                                    ALTER COLUMN "password" DROP NOT NULL,
                                    ALTER COLUMN "participantId" DROP NOT NULL,
                                    ALTER COLUMN "participantCode" DROP NOT NULL
                                ;`;
        await queryRunner.query(command);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `ALTER TABLE public."participant"
                                    ALTER COLUMN "name" SET NOT NULL,
                                    ALTER COLUMN "email" SET NOT NULL,
                                    ALTER COLUMN "password" SET NOT NULL,
                                    ALTER COLUMN "participantId" SET NOT NULL,
                                    ALTER COLUMN "participantCode" SET NOT NULL
                                ;`;
        await queryRunner.query(command);
    }

}
