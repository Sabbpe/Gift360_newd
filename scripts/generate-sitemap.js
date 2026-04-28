import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://gift360.io';
const APP_PATH = path.resolve(__dirname, '../src/App.tsx');
const OUTPUT_PATH = path.resolve(__dirname, '../public/sitemap.xml');

function generateSitemap() {
    try {
        const content = fs.readFileSync(APP_PATH, 'utf8');

        // Match <Route path="/..." /> or location === "/..."
        const routeRegex = /path="([^"]+)"|location === "([^"]+)"/g;
        const routes = new Set();
        let match;

        while ((match = routeRegex.exec(content)) !== null) {
            const route = match[1] || match[2];
            if (route && !route.includes(':') && route !== '*') {
                routes.add(route);
            }
        }

        // Add root if not found
        routes.add('/');

        const sitemapEntries = Array.from(routes).sort().map(route => {
            const priority = route === '/' ? '1.0' : '0.8';
            const changefreq = route === '/' ? 'daily' : 'weekly';
            return `
  <url>
    <loc>${BASE_URL}${route === '/' ? '' : route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
        }).join('');

        const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`;

        fs.writeFileSync(OUTPUT_PATH, sitemapXml);
        console.log(`✅ Sitemap successfully generated at: ${OUTPUT_PATH}`);
        console.log(`🌐 Total routes indexed: ${routes.size}`);
    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
    }
}

generateSitemap();
