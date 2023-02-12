import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1675973615410 implements MigrationInterface {
    name = 'Initial1675973615410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, INDEX \`email-idx\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`task\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(36) NOT NULL, \`status\` varchar(4) NOT NULL, \`description\` text NOT NULL, INDEX \`assign_status_id\` (\`userId\`, \`status\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_f316d3fe53497d4d8a2957db8b9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_f316d3fe53497d4d8a2957db8b9\``);
        await queryRunner.query(`DROP INDEX \`assign_status_id\` ON \`task\``);
        await queryRunner.query(`DROP TABLE \`task\``);
        await queryRunner.query(`DROP INDEX \`email-idx\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
