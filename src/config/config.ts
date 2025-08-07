interface ServerConfig {
  port: number;
  host: string;
  environment: string;
}

interface FilesUploadConfig {
  maxFileSize: number;
  bucketName: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

interface ApiConfig {
  version: string;
  basePath: string;
}

interface CorsConfig {
  origin: string | string[];
  credentials: boolean;
  methods: string[];
  allowedHeaders: string[];
}

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

interface Config {
  server: ServerConfig;
  filesUpload: FilesUploadConfig;
  api: ApiConfig;
  cors: CorsConfig;
  database: DatabaseConfig;
}

const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  filesUpload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10', 10) * 1024 * 1024,
    bucketName: process.env.AWS_BUCKET_NAME || '',
    region: process.env.AWS_REGION || 'eu-west-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  api: {
    version: 'v1',
    basePath: '/api',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  },
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'backend_db',
  },
};

export default config;