import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableNames } from '../../utils/constants/table-names.constant';
import { schemas } from '../constants/schemas.constant';

export class OtpMigration1706692517036 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TableNames.OTP,
        columns: [
          schemas.id,
          schemas.createdAt,
          schemas.updatedAt,
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'code',
            type: 'varchar',
            length: '6',
          },
          {
            name: 'expires_at',
            type: 'timestamptz',
            default: "CURRENT_TIMESTAMP + INTERVAL '5 minutes'",
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TableNames.OTP);
  }
}
