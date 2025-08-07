import { db } from '../database/database';

const FILES_TABLE = 'files';

export type File = {
    id?: string;
    title: string;
    description: string;
    category: string;
    language: string;
    provider: string;
    roles: object;
    path: string;
    uploaded_at?: Date;
}

/**
 * This function inserts a file record in the db.
 * @param file - The file object
 * @returns The id of the inserted file
 * @throws Will throw an error if the database insert fails
 */
export const insertFile = async (file: File) => {
  const insertedFile = await db.insertInto(FILES_TABLE)
  .values(file)
  .returning(['id'])
  .executeTakeFirstOrThrow();

  return insertedFile.id;
}

/**
 * This function lists all files in the db.
 * @returns The files in the db
 */
export const listFiles = async (limit: number = 100, offset: number = 0) => {
  const files = await db.selectFrom(FILES_TABLE)
  .selectAll()
  .orderBy('uploaded_at', 'desc')
  .limit(limit)
  .offset(offset)
  .execute();

  return files;
}

/**
 * This function gets a file from the db by its id.
 * @param id - The id of the file
 * @returns The file
 */
export const getFile = async (id: string) => {
  const file = await db.selectFrom(FILES_TABLE)
  .selectAll()
  .where('id', '=', id)
  .executeTakeFirstOrThrow();

  return file;
}

/**
 * This function gets the total number of files
 * @returns The total number of files
 */
export const getTotalNumberOfFiles = async () => {
  const result = await db.selectFrom(FILES_TABLE)
  .select(({ fn, val, ref }) => fn.countAll().as('count'))
  .executeTakeFirst();

  return result?.count ?? 0;
}

/**
 * This function gets the number of files by category
 * @returns The number of files
 */
export const getNumberOfFilesByCategory = async () => {
  const result = await db.selectFrom(FILES_TABLE)
  .select(['category'])
  .select(({ fn }) => fn.countAll().as('count'))
  .groupBy('category')
  .execute();

  return result;
}

/**
 * This function gets the number of files by language
 * @returns The number of files
 */
export const getNumberOfFilesByLanguage = async () => {
  const result = await db.selectFrom(FILES_TABLE)
  .select(['language'])
  .select(({ fn }) => fn.countAll().as('count'))
  .groupBy('language')
  .execute();

  return result;
}




