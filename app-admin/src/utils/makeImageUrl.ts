import {EC_SITE_PRODUCT_BUCKET, SUPABASE_URL} from '@/constants/constants';

export function makeImageUrl(storagePath: string) {
  const base = SUPABASE_URL;
  const bucket = EC_SITE_PRODUCT_BUCKET!;
  // 경로 깨짐 방지
  const clean = storagePath.replace(/^\/+/, '');
  return `${base}/storage/v1/object/public/${bucket}/${encodeURI(clean)}`;
}
