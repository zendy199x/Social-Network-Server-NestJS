import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';
import { UserGender } from '../../common/enums/user.enum';
import { TableNames } from '../../utils/constants/table-names.constant';
import { schemas } from '../constants/schemas.constant';
import { dropForeignKeysByColumnNames } from '../helpers/drop-foreign-keys';

export class UserMigration1706111375580 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TableNames.USER,
        columns: [
          schemas.id,
          schemas.createdAt,
          schemas.updatedAt,
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'username',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'first_name',
            type: 'varchar',
          },
          {
            name: 'last_name',
            type: 'varchar',
          },
          {
            name: 'dob',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'gender',
            type: 'enum',
            enum: [UserGender.MALE, UserGender.FEMALE, UserGender.OTHER],
            enumName: 'user_gender_enum',
            isNullable: true,
          },
          {
            name: 'email_verified',
            type: 'boolean',
            default: false,
          },
          {
            name: 'blacklisted_tokens',
            type: 'varchar',
            isArray: true,
            isNullable: true,
          },
          {
            name: 'avatar_id',
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      TableNames.USER,
      new TableIndex({
        name: 'email_idx',
        columnNames: ['email'],
      }),
    );

    await queryRunner.createIndex(
      TableNames.USER,
      new TableIndex({
        name: 'username_idx',
        columnNames: ['username'],
      }),
    );

    await queryRunner.createForeignKey(
      TableNames.USER,
      new TableForeignKey({
        columnNames: ['avatar_id'],
        referencedColumnNames: ['id'],
        referencedTableName: TableNames.FILE,
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropForeignKeysByColumnNames(queryRunner, TableNames.USER, [
      'avatar_id',
    ]);
    await queryRunner.dropIndex(TableNames.USER, 'email_idx');
    await queryRunner.dropIndex(TableNames.USER, 'username_idx');
    await queryRunner.dropTable(TableNames.USER);
  }
}
