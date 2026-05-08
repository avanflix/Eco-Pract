import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const S3_BUCKET = process.env.S3_BUCKET_NAME || 'ecoforever'; // Defaulting or waiting for input
const R2_ACCOUNT_ID = process.env.R2_ID;
const ACCESS_KEY_ID = process.env.ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const S3_API = process.env.url; // url from .env

if (!S3_BUCKET || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    console.warn('S3/R2 environment variables are missing.');
}

const s3Client = new S3Client({
    region: 'auto',
    endpoint: S3_API || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: ACCESS_KEY_ID!,
        secretAccessKey: SECRET_ACCESS_KEY!,
    },
});

export async function uploadToR2(file: Buffer, filename: string, contentType: string): Promise<string> {
    const key = `products/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: file,
        ContentType: contentType,
        // ACL: 'public-read', // R2 might not support ACLs depending on bucket settings
    });

    try {
        await s3Client.send(command);
        // Construct public URL - adjust domain as needed
        // If using a custom domain or R2.dev domain
        const publicUrl = process.env.S3_PUBLIC_URL
            ? `${process.env.S3_PUBLIC_URL}/${key}`
            : `${S3_API}/${S3_BUCKET}/${key}`;

        return publicUrl;
    } catch (error) {
        console.error('Error uploading to R2:', error);
        throw new Error('Failed to upload image');
    }
}
