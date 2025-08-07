import { Kysely, sql } from 'kysely'

const filesTable = 'files'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('files')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('title', 'varchar(200)', (col) => col.notNull())
    .addColumn('description', 'varchar(1000)', (col) => col.notNull())
    .addColumn('category', 'varchar', (col) => col.notNull())
    .addColumn('language', 'varchar', (col) => col.notNull())
    .addColumn('provider', 'varchar', (col) => col.notNull())
    .addColumn('roles', 'jsonb', (col) => col.notNull())
    .addColumn('path', 'varchar(255)', (col) => col.notNull())
    .addColumn('uploaded_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(filesTable).execute()
}