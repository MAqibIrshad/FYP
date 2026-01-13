import "server-only"

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {prisma} from "../lib/db";
import {env} from "../lib/env";
import {emailOTP} from "better-auth/plugins";
import {resend} from '../lib/resend'
import {admin} from 'better-auth/plugins'
import 'server-only'
    export const auth = betterAuth({
        database: prismaAdapter(prisma, {
            provider: "postgresql", // or "mysql", "postgresql", ...etc
        }),
        socialProviders: {
            github: {
                clientId: env.AUTH_GITHUB_CLIENT_ID,
                clientSecret: env.AUTH_GITHUB_SECRET,
            },
        },
        plugins:[
            emailOTP({
                async sendVerificationOTP({ email, otp }) {
                    await resend.emails.send({
                            from: 'Acme <onboarding@resend.dev>',
                            to: [email],
                            subject: 'GengrowLMS - Verify your email',
                            html: `<div style="font-family: sans-serif; line-height: 1.6;">
      <h2>Verify your GengrowLMS Account</h2>
      <p>Enter the following code to continue:</p>
      <h1 style="letter-spacing: 3px; color: #4F46E5;">${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
    </div>`
                    });
                },
            }),
            admin()
        ],
        
        });
