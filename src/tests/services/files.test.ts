import { insertFile, listFiles, getFile, getTotalNumberOfFiles, getNumberOfFilesByCategory, getNumberOfFilesByLanguage, File } from '../../services/files';
import { db } from '../../database/database';

jest.mock('../../database/database', () => ({
  db: {
    insertInto: jest.fn(),
    selectFrom: jest.fn(),
  },
}));

const mockDb = db as jest.Mocked<typeof db>;

describe('Files Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('insertFile', () => {

    it('should insert a file and return the id', async () => {

      const mockFile: File = {
        title: 'test',
        description: 'test',
        category: 'test',
        language: 'english',
        provider: 'provider',
        roles: { role_names: ['admin'] },
        path: 'uploads/test-file.pdf',
      };

      const mockInsertQuery = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        executeTakeFirstOrThrow: jest.fn().mockResolvedValue({ id: 'test-id-123' }),
      };
      mockDb.insertInto.mockReturnValue(mockInsertQuery as any);

      const result = await insertFile(mockFile);

      expect(mockDb.insertInto).toHaveBeenCalledWith('files');
      expect(mockInsertQuery.values).toHaveBeenCalledWith(mockFile);
      expect(mockInsertQuery.returning).toHaveBeenCalledWith(['id']);
      expect(result).toBe('test-id-123');
    });
  });

  describe('listFiles', () => {

    it('should return files with default pagination', async () => {

      const mockFiles = [
        { id: 'a1', title: 'File 1', uploaded_at: new Date() },
        { id: 'a2', title: 'File 2', uploaded_at: new Date() },
      ];

      const mockSelectQuery = {
        selectAll: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(mockFiles),
      };

      mockDb.selectFrom.mockReturnValue(mockSelectQuery as any);

      const result = await listFiles();

      expect(mockDb.selectFrom).toHaveBeenCalledWith('files');
      expect(mockSelectQuery.selectAll).toHaveBeenCalled();
      expect(mockSelectQuery.orderBy).toHaveBeenCalledWith('uploaded_at', 'desc');
      expect(mockSelectQuery.limit).toHaveBeenCalledWith(100);
      expect(mockSelectQuery.offset).toHaveBeenCalledWith(0);
      expect(result).toEqual(mockFiles);
    });
  });

  describe('getFile', () => {
    
    it('should return a file by id', async () => {

      const mockFile = {
        id: 'test-id',
        title: 'test',
        description: 'test',
        category: 'test',
        language: 'english',
        provider: 'provider',
        roles: { role_names: ['admin'] },
        path: 'uploads/test-file.pdf',
        uploaded_at: new Date(),
      };

      const mockSelectQuery = {
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        executeTakeFirstOrThrow: jest.fn().mockResolvedValue(mockFile),
      };
      mockDb.selectFrom.mockReturnValue(mockSelectQuery as any);

      const result = await getFile('test-id');

      expect(mockDb.selectFrom).toHaveBeenCalledWith('files');
      expect(mockSelectQuery.selectAll).toHaveBeenCalled();
      expect(mockSelectQuery.where).toHaveBeenCalledWith('id', '=', 'test-id');
      expect(result).toEqual(mockFile);
    });

    it('should throw an error when file not found', async () => {
      const mockSelectQuery = {
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        executeTakeFirstOrThrow: jest.fn().mockRejectedValue(new Error('File not found')),
      };

      mockDb.selectFrom.mockReturnValue(mockSelectQuery as any);

      await expect(getFile('non-existent-id')).rejects.toThrow('File not found');
    });
  });

  describe('getTotalNumberOfFiles', () => {

    it('should return the total number of files', async () => {

      const mockSelectQuery = {
        select: jest.fn().mockReturnThis(),
        executeTakeFirst: jest.fn().mockResolvedValue({ count: 100 }),
      };

      mockDb.selectFrom.mockReturnValue(mockSelectQuery as any);

      const result = await getTotalNumberOfFiles();

      expect(mockDb.selectFrom).toHaveBeenCalledWith('files');
      expect(result).toBe(100);
    });

    it('should return zero when no files exist', async () => {
      const mockSelectQuery = {
        select: jest.fn().mockReturnThis(),
        executeTakeFirst: jest.fn().mockResolvedValue(null),
      };

      mockDb.selectFrom.mockReturnValue(mockSelectQuery as any);

      const result = await getTotalNumberOfFiles();

      expect(result).toBe(0);
    });
  });

  describe('getNumberOfFilesByCategory', () => {

    it('should return files grouped by category', async () => {

      const mockResult = [
        { category: 'test', count: 10 },
        { category: 'test2', count: 5 },
      ];

      const mockSelectQuery = {
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(mockResult),
      };

      mockDb.selectFrom.mockReturnValue(mockSelectQuery as any);

      const result = await getNumberOfFilesByCategory();

      expect(mockDb.selectFrom).toHaveBeenCalledWith('files');
      expect(mockSelectQuery.groupBy).toHaveBeenCalledWith('category');
      expect(result).toEqual(mockResult);
    });
  });

  describe('getNumberOfFilesByLanguage', () => {

    it('should return files grouped by language', async () => {

      const mockResult = [
        { language: 'english', count: 15 },
        { language: 'italian', count: 28 },
      ];

      const mockSelectQuery = {
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(mockResult),
      };

      mockDb.selectFrom.mockReturnValue(mockSelectQuery as any);

      const result = await getNumberOfFilesByLanguage();

      expect(mockDb.selectFrom).toHaveBeenCalledWith('files');
      expect(mockSelectQuery.groupBy).toHaveBeenCalledWith('language');
      expect(result).toEqual(mockResult);
    });
  });
}); 