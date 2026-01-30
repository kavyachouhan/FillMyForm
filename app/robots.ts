import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://fillmyform.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/fill/progress/', '/fill/result/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}