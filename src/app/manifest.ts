import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lineage Kernelcrafter',
    short_name: 'K-Crafter',
    description: 'Specialized Android kernel development app for SM8550',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0f0b',
    theme_color: '#00ff55',
    icons: [
      {
        src: 'https://picsum.photos/seed/kcrafter/192/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://picsum.photos/seed/kcrafter/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
