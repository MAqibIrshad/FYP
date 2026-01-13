// import { NextResponse } from "next/server";
// import { z } from "zod";
// import { PutObjectCommand } from "@aws-sdk/client-s3";
// import { env } from "@/lib/env";
// import { v4 as uuidv4 } from "uuid";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { S3 } from "@/lib/S3Client";

// export const fileUploadSchema = z.object({
//   fileName: z.string().min(1),
//   contentType: z.string().min(1),
//   size: z.number().min(1),
//   isImage: z.boolean(),
// });

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     const validation = fileUploadSchema.safeParse(body);
//     if (!validation.success) {
//       return NextResponse.json(
//         { error: "Invalid Request Body" },
//         { status: 400 }
//       );
//     }

//     const { fileName, contentType, size } = validation.data;

//     const unique = `${uuidv4()}-${fileName}`;

//     const cmd = new PutObjectCommand({
//       Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
//       Key: unique,
//       ContentType: contentType,
//       // ContentLength: size,
//     });

//     const presignedUrl = await getSignedUrl(S3, cmd, {
//       expiresIn: 360,
//     });

//     return NextResponse.json({
//       presignedUrl,
//       key: unique,
//     });
//   } catch (err) {
//     console.error("Presign error:", err);
//     return NextResponse.json(
//       { error: "Failed to generate presigned URL" },
//       { status: 500 }
//     )
// }
// }

// app/api/s3/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { presignedUrl, fileName, fileType, file } = body;

    if (!presignedUrl || !file) {
      console.error("Missing presignedUrl or file");
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const buffer = Buffer.from(file, "base64");

    await axios.put(presignedUrl, buffer, {
      headers: { "Content-Type": fileType },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error in API route:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
