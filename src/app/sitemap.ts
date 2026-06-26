import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.talentsync360.com';
  const routes = ['', '/companies', '/talents', '/methodology', '/contact', '/privacy', '/terms', '/en/nearshore-developers-latam', '/en/it-consultancies-spain'];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
