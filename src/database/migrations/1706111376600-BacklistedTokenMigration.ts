import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { TableNames } from '../../utils/constants/table-names.constant';
import { schemas } from '../constants/schemas.constant';
import { dropForeignKeysByColumnNames } from '../helpers/drop-foreign-keys';

export class BacklistedTokenMigration1706111376600
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TableNames.BLACKLISTED_TOKEN,
        columns: [
          schemas.id,
          schemas.createdAt,
          schemas.updatedAt,
          {
            name: 'token',
            type: 'varchar',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      TableNames.BLACKLISTED_TOKEN,
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: TableNames.USER,
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropForeignKeysByColumnNames(
      queryRunner,
      TableNames.BLACKLISTED_TOKEN,
      ['user_id'],
    );

    await queryRunner.dropTable(TableNames.BLACKLISTED_TOKEN);
  }
}
