import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const u = new URL(supabaseUrl)

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
    serverActions: {
      bodySizeLimit: '10mb', // 필요 용량으로
    },
  },
  images: {
    remotePatterns: u
      ? [
          {
            protocol: u.protocol.slice(0, -1) as 'http' | 'https', // ':' 제거 + 타입 고정
            hostname: u.hostname,
            port: u.port || undefined, // '' 금지
            pathname: '/storage/v1/object/public/**',
          },
        ]
      : [],
  },
}

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true', // 빌드시 alanalyze 모드 활성화 여부
  openAnalyzer: true, // 번들 분석기 활성화 된 채로 빌드 완료 => 분석 결과 페이지 브라우저로 자동 열기
})

export default bundleAnalyzer(nextConfig)
