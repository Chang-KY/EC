import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true', // 빌드시 alanalyze 모드 활성화 여부
  openAnalyzer: true, // 번들 분석기 활성화 된 채로 빌드 완료 => 분석 결과 페이지 브라우저로 자동 열기
})

export default bundleAnalyzer(nextConfig)
