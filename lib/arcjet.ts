import "server-only"
import arcjet, {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    shield,
    slidingWindow
} from '@arcjet/next'
import {env} from "@/lib/env";
import 'server-only'

export {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    shield,
    slidingWindow
};

export const client = arcjet ({
    key:env.ARCJET_KEY,
    characteristics: ["fingerprint"],
    rules: [
        shield({
            mode:"LIVE",
        })
    ]
})