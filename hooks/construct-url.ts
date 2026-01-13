import { env } from "@/lib/env";
export function useConstructUrl(key?: string | null): string | null {
  if (!key || key.trim() === "") return null;

  // encode key to handle spaces or special characters
  return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.fly.storage.tigris.dev/${encodeURIComponent(key)}`;
}
