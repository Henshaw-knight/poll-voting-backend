import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1778611927462 implements MigrationInterface {
    name = 'InitialSchema1778611927462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "state" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."polls_status_enum" AS ENUM('active', 'closed')`);
        await queryRunner.query(`CREATE TABLE "polls" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "status" "public"."polls_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" uuid, CONSTRAINT "PK_b9bbb8fc7b142553c518ddffbb6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "poll_options" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "optionText" character varying NOT NULL, "pollId" uuid, CONSTRAINT "PK_f52aac4865d291e3658dedf9083" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "votes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "state" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "pollId" uuid, "optionId" uuid, CONSTRAINT "UQ_e59c5c77879a5ba43d8ee7cf15c" UNIQUE ("userId", "pollId"), CONSTRAINT "PK_f3d9fd4a0af865152c3f59db8ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "polls" ADD CONSTRAINT "FK_9f427450a5df5e35ec87d8a0e75" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "poll_options" ADD CONSTRAINT "FK_4edaafa5d0ea2a447af004706a4" FOREIGN KEY ("pollId") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "votes" ADD CONSTRAINT "FK_5169384e31d0989699a318f3ca4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "votes" ADD CONSTRAINT "FK_2e40638d2d3b898da1af363837c" FOREIGN KEY ("pollId") REFERENCES "polls"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "votes" ADD CONSTRAINT "FK_70b83e1b0a90b9491cfdc73f52d" FOREIGN KEY ("optionId") REFERENCES "poll_options"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "votes" DROP CONSTRAINT "FK_70b83e1b0a90b9491cfdc73f52d"`);
        await queryRunner.query(`ALTER TABLE "votes" DROP CONSTRAINT "FK_2e40638d2d3b898da1af363837c"`);
        await queryRunner.query(`ALTER TABLE "votes" DROP CONSTRAINT "FK_5169384e31d0989699a318f3ca4"`);
        await queryRunner.query(`ALTER TABLE "poll_options" DROP CONSTRAINT "FK_4edaafa5d0ea2a447af004706a4"`);
        await queryRunner.query(`ALTER TABLE "polls" DROP CONSTRAINT "FK_9f427450a5df5e35ec87d8a0e75"`);
        await queryRunner.query(`DROP TABLE "votes"`);
        await queryRunner.query(`DROP TABLE "poll_options"`);
        await queryRunner.query(`DROP TABLE "polls"`);
        await queryRunner.query(`DROP TYPE "public"."polls_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
