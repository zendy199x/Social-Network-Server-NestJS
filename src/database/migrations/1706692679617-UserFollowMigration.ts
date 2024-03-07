import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { TableNames } from '../../utils/constants/table-names.constant';
import { schemas } from '../constants/schemas.constant';
import { dropForeignKeysByColumnNames } from '../helpers/drop-foreign-keys';

export class UserFollowMigration1706692679617 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TableNames.USER_FOLLOW,
        columns: [
          schemas.id,
          schemas.createdAt,
          schemas.updatedAt,
          {
            name: 'follower_id',
            type: 'uuid',
          },
          {
            name: 'following_id',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    const foreignKeys = [
      new TableForeignKey({
        columnNames: ['follower_id'],
        referencedColumnNames: ['id'],
        referencedTableName: TableNames.USER,
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['following_id'],
        referencedColumnNames: ['id'],
        referencedTableName: TableNames.USER,
        onDelete: 'CASCADE',
      }),
    ];

    for (const foreignKey of foreignKeys) {
      await queryRunner.createForeignKey(TableNames.USER_FOLLOW, foreignKey);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropForeignKeysByColumnNames(queryRunner, TableNames.USER_FOLLOW, [
      'follower_id',
      'following_id',
    ]);

    await queryRunner.dropTable(TableNames.USER_FOLLOW);
  }
}
