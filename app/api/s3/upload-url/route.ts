// app/api/s3/upload-url/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName, contentType } = body;

    if (!fileName || !contentType) {
      return NextResponse.json({ error: "Missing fileName or contentType" }, { status: 400 });
    }

    const key = `uploads/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES!,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    return NextResponse.json({ presignedUrl, key });
  } catch (err: any) {
    console.error("Error generating presigned URL:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
