# Skyber SEO Strategy & Execution

This document outlines the SEO optimizations implemented for the SabbPe platform to ensure maximum visibility and high ranking on Google.

## 1. Automated Sitemap Generation
- **Mechanism**: A custom Node.js script (`scripts/generate-sitemap.js`) that scans the application's routing logic.
- **Auto-Discovery**: Automatically detects new static routes without manual entry.
- **Build Integration**: Synchronized with `npm run build` to ensure the sitemap is always up-to-date.
- **Search Engine Visibility**: Submitted via `robots.txt` for automatic discovery by Google Search Console.

## 2. Crawler Policy (Robots.txt)
- **User-Agent Management**: Optimized for `Googlebot`, `Bingbot`, and other major crawlers.
- **Strategic Blocking**: Prevents indexing of sensitive or redundant paths like `/admin`, `/config`, and `/api`.
- **Sitemap Declaration**: Explicitly points to the production sitemap URL.

## 3. On-Page SEO Optimizations
- **Dynamic Meta Tags**: Automated updates for `<title>` and `<meta name="description">` on every page using React effects.
- **Semantic HTML**: Proper use of `<h1>` through `<h6>` tags and HTML5 semantic elements (main, section, article).
- **Image Optimization**: Descriptive `alt` text and aspect-ratio management for featured blog images.
- **Canonical Links**: Ensured single-source truth for page URLs to prevent duplicate content issues.

## 4. Technical SEO Performance
- **Mobile-First Indexing**: Super-optimized layouts for mobile devices to meet Google's Core Web Vitals.
- **Fast Load Times**: Minimized layout shifts and optimized asset delivery via Vite.
- **Clean URL Structure**: Human-readable and keyword-rich URLs (e.g., `/blogs/voucher-tips`, `/faq`).

## 5. Ongoing Monitoring
- **Sitemap Stats**: Currently indexing 21+ priority routes.
- **Category Coverage**: Deep indexing of FAQ categories and individual blog posts.
