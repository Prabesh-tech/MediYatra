import { randomUUID } from "node:crypto";
import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ALLOWED_CONTENT_TYPES = new Set(["application/pdf", "image/jpeg"]);
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const UPLOAD_URL_TTL_SECONDS = 300;
const DOWNLOAD_URL_TTL_SECONDS = 60;

@Injectable()
export class S3StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(config: ConfigService) {
    this.bucket = config.get<string>("S3_BUCKET") ?? "";
    const accessKeyId = config.get<string>("S3_ACCESS_KEY_ID");
    const secretAccessKey = config.get<string>("S3_SECRET_ACCESS_KEY");
    this.client = new S3Client({
      region: config.get<string>("S3_REGION", "auto"),
      endpoint: config.get<string>("S3_ENDPOINT") || undefined,
      forcePathStyle: Boolean(config.get<string>("S3_ENDPOINT")),
      ...(accessKeyId && secretAccessKey
        ? { credentials: { accessKeyId, secretAccessKey } }
        : {}),
    });
  }

  async createUploadUrl(
    ownerId: string,
    filename: string,
    contentType: string,
    sizeBytes: number,
  ): Promise<{ key: string; url: string; expiresIn: number; headers: Record<string, string> }> {
    this.assertConfigured();
    if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
      throw new BadRequestException("Unsupported document type");
    }
    if (!Number.isInteger(sizeBytes) || sizeBytes < 1 || sizeBytes > MAX_DOCUMENT_SIZE) {
      throw new BadRequestException("Document size is outside the allowed range");
    }

    const safeName = filename.replace(/[\\/\r\n\0]/g, "_").slice(0, 120) || "document";
    const key = `medical-documents/${ownerId}/${randomUUID()}-${safeName}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
      ContentLength: sizeBytes,
      ServerSideEncryption: "AES256",
    });
    const url = await getSignedUrl(this.client, command, { expiresIn: UPLOAD_URL_TTL_SECONDS });
    return {
      key,
      url,
      expiresIn: UPLOAD_URL_TTL_SECONDS,
      headers: { "content-type": contentType, "x-amz-server-side-encryption": "AES256" },
    };
  }

  async verifyUploadedObject(
    ownerId: string,
    key: string,
    contentType: string,
    sizeBytes: number,
  ): Promise<void> {
    this.assertConfigured();
    if (!key.startsWith(`medical-documents/${ownerId}/`)) {
      throw new BadRequestException("Document is not available to this user");
    }
    const object = await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key }));
    if (
      object.ContentLength !== sizeBytes
      || object.ContentType !== contentType
      || object.ServerSideEncryption !== "AES256"
    ) {
      throw new BadRequestException("Uploaded document metadata does not match the request");
    }
  }

  async createDownloadUrl(ownerId: string, key: string): Promise<{ url: string; expiresIn: number }> {
    this.assertConfigured();
    if (!key.startsWith(`medical-documents/${ownerId}/`)) {
      throw new BadRequestException("Document is not available to this user");
    }

    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    const url = await getSignedUrl(this.client, command, { expiresIn: DOWNLOAD_URL_TTL_SECONDS });
    return { url, expiresIn: DOWNLOAD_URL_TTL_SECONDS };
  }

  private assertConfigured(): void {
    if (!this.bucket) throw new ServiceUnavailableException("Document storage is not configured");
  }
}
