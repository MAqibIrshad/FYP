import { auth } from '@/lib/auth';
import { env } from '@/lib/env';
import arcjet, { detectBot, fixedWindow } from '@arcjet/next';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { headers } from 'next/headers';
import {NextResponse} from 'next/server'
import { S3 } from '@/lib/S3Client';
const aj = arcjet({
    key: process.env.ARCJET_KEY!,  // or your Arcjet site key
    rules: [
        detectBot({
            mode: "LIVE",
            allow: [],
        }),
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5,
        }),
    ],
});
export async function DELETE(request: Request){
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    try{

        const decision = await aj.protect(request);

        if(decision.isDenied()){
            return NextResponse.json({error: "dude not good"}, { status: 429 });
        }

        const body = await request.json();
        const {key} = body;

        if(!key){
            return NextResponse.json(
                { error: "Missing or Invalid object key" },
                {
                    status: 400,
                }
            );
        }

        const command = new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            Key: key,
        });
        
        await S3.send(command);
        return NextResponse.json(
                { error: "Successfully Deleted!" },
                {
                    status: 200,
                }
            );

    }

    catch{
        return NextResponse.json(
                { error: "Missing or Invalid object key" },
                {
                    status: 500,
                }
            );
    }
}




