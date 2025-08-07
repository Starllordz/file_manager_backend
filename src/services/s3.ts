import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import config from '../config/config';
import { Readable } from 'stream';


const s3Client = new S3Client({
    region: config.filesUpload.region,
    credentials: {
      accessKeyId: config.filesUpload.accessKeyId,
      secretAccessKey: config.filesUpload.secretAccessKey,
    },
  });
  
  interface S3UploadResult {
    key: string;
    location: string;
  }
  
  /**
   * This function uploads a file to S3
   * @param fileBuffer - The file buffer
   * @param fileName - The name of the file
   * @param mimeType - The mime type
   * @returns Promise with upload result
   */
  export const uploadToS3 = async (
    fileBuffer: Buffer | Readable,
    filename: string,
    mimeType: string
  ): Promise<S3UploadResult> => {

    const timestamp = Date.now();
    const key = `uploads/${timestamp}-${filename}`;
  
    try {

      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: config.filesUpload.bucketName,
          Key: key,
          Body: fileBuffer,
          ContentType: mimeType,
        },
        queueSize: 4,
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false,
      });
  
      const result = await upload.done();
  
      return {
        key,
        location: result.Location || '',
      };
    } catch (error) {

        console.error('Error uploading to S3:', error);
        throw new Error(`Failed to upload file to S3: ${error as string}`);
    }
  };
  
  /**
   * Generate a pre-signed URL
   * @param key - The S3 object key
   * @param expiresIn - Expiration time in seconds
   * @returns The promise of the pre-signed URL 
   */
  export const getPreSignedUrl = async (key: string, expiresIn: number = 3600): Promise<string> => {
  
    const command = new GetObjectCommand({
      Bucket: config.filesUpload.bucketName,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });

    return url;
  };