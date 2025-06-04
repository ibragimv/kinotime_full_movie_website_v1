import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const baseUrl = 'https://kinotime.world';

// __dirname olish (ESM uchun workaround)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateSitemap() {
  const staticUrls = [
    `${baseUrl}/`,
    `${baseUrl}/movies`,
    `${baseUrl}/serials`,
    `${baseUrl}/catalog.html`,
    `${baseUrl}/search`,
    `${baseUrl}/premiere`,
    `${baseUrl}/developing`,
    `${baseUrl}/dmca`,
    `${baseUrl}/notfound`,
    `${baseUrl}/haqimizda`,
    `${baseUrl}/aloqa`,
    `${baseUrl}/maxfiylik`,
    `${baseUrl}/reklama-uchun`,
  ];

  // === MOVIES ===
  const movieRes = await axios.get('https://api.kinotime.world/api/movies');
  const movies = movieRes.data;
  const movieUrls = movies.map((movie) => {
    const slug = movie.name.toLowerCase().replace(/\s+/g, '-');
    return `${baseUrl}/movie/${slug}.html`;
  });

  // === SERIALS ===
  const serialRes = await axios.get('https://api.kinotime.world/api/serials');
  const serials = serialRes.data;
  const serialUrls = serials.map((serial) => {
    const slug = serial.name.toLowerCase().replace(/\s+/g, '-');
    return `${baseUrl}/serial/${slug}.html`;
  });

  const allUrls = [...staticUrls, ...movieUrls, ...serialUrls];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    allUrls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n') +
    `\n</urlset>`;

  fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), xml, 'utf8');
  console.log(`✅ sitemap.xml created with ${allUrls.length} pages`);
}

generateSitemap().catch((err) => {
  console.error('❌ Error generating sitemap:', err.message);
});
