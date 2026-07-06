import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

// Maps accepted image content types to file extensions.
const ALLOWED_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
};

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

const bucket = process.env.S3_BUCKET;
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const endpoint = process.env.S3_ENDPOINT; // optional (omit for real AWS S3)
const region = process.env.S3_REGION || 'us-east-1';
// Most S3-compatible stores (MinIO, Lucity, etc.) need path-style addressing.
const forcePathStyle = process.env.S3_FORCE_PATH_STYLE !== 'false';

/**
 * Image uploads are entirely optional: the feature is only enabled when a
 * bucket and credentials are present. Everything else in the app degrades
 * gracefully when this returns false.
 */
export function isStorageConfigured(): boolean {
  return Boolean(bucket && accessKeyId && secretAccessKey);
}

let client: S3Client | null = null;

function getClient(): S3Client {
  if (!client) {
    client = new S3Client({
      region,
      endpoint: endpoint || undefined,
      forcePathStyle,
      credentials: {
        accessKeyId: accessKeyId as string,
        secretAccessKey: secretAccessKey as string,
      },
    });
  }
  return client;
}

/** Returns the file extension for a supported image type, or null. */
export function extensionForType(contentType: string): string | null {
  return ALLOWED_TYPES[contentType] ?? null;
}

/** Uploads an image buffer and returns the generated object key. */
export async function uploadImage(
  body: Buffer,
  contentType: string
): Promise<string> {
  const ext = extensionForType(contentType);
  if (!ext) throw new Error('Unsupported image type');

  const key = `uploads/${randomUUID()}.${ext}`;
  await getClient().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return key;
}

/** Fetches an object from the bucket, or null if it is missing. */
export async function getImage(
  key: string
): Promise<{ body: Uint8Array; contentType: string } | null> {
  try {
    const res = await getClient().send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    );
    if (!res.Body) return null;
    const body = await res.Body.transformToByteArray();
    return {
      body,
      contentType: res.ContentType || 'application/octet-stream',
    };
  } catch {
    return null;
  }
}
