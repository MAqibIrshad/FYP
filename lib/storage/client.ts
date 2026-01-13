// lib/storage/client.ts
import { S3Client, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

// S3 Client (for AWS S3)
export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// Tigris Client (HTTP-based)
export class TigrisClient {
  private baseUrl = 'https://api.preview.tigrisdata.com'
  private project = process.env.TIGRIS_PROJECT!
  private branch = process.env.TIGRIS_BRANCH || 'main'

  async getPresignedUrl(bucket: string, key: string, operation: 'READ' | 'WRITE', contentType?: string) {
    const response = await fetch(`${this.baseUrl}/v1/projects/${this.project}/branches/${this.branch}/buckets/${bucket}/files/presign`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TIGRIS_APP_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key,
        operation,
        expirySeconds: 3600,
        ...(contentType && { contentType }),
      }),
    })

    if (!response.ok) {
      throw new Error(`Tigris presign failed: ${response.status}`)
    }

    return response.json()
  }

  async deleteFile(bucket: string, keys: string[]) {
    const response = await fetch(`${this.baseUrl}/v1/projects/${this.project}/branches/${this.branch}/buckets/${bucket}/files/delete`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.TIGRIS_APP_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keys }),
    })

    if (!response.ok) {
      throw new Error(`Tigris delete failed: ${response.status}`)
    }

    return response.json()
  }
}

export const tigrisClient = new TigrisClient()