import { MigrationInterface, QueryRunner } from "typeorm"

export class RemoveNotNullInUser1698312636998 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const command: string = `ALTER TABLE public."user"
                                    ALTER COLUMN "name" DROP NOT NULL,
                                    ALTER COLUMN "email" DROP NOT NULL,
                                    ALTER COLUMN "password" DROP NOT NULL
                                ;`;
        await queryRunner.query(command);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const command: string = `ALTER TABLE public."user"
                                    ALTER COLUMN "name" SET NOT NULL,
                                    ALTER COLUMN "email" SET NOT NULL,
                                    ALTER COLUMN "password" SET NOT NULL
                                ;`;
        await queryRunner.query(command);
    }

}
