# Neptune Trading Company Website

Static corporate website for Neptune Trading Company (Pvt) Ltd. The site is built with plain HTML, CSS, and JavaScript for deployment to cPanel `public_html`.

## Pages

- `index.html` is the homepage.
- `about.html` presents Neptune Trading Company as a separate trading entity.
- `what-we-do.html` explains sourcing, procurement, exports, and market-entry support.
- `principals.html` presents represented principal brands.
- `product-divisions.html` introduces HUMMER Power Products and Metal Alloys Corporation.
- `hummer-products.html` presents HUMMER product categories for B2B enquiry.
- `metal-alloys-products.html` presents Metal Alloys Corporation product categories for B2B enquiry.
- `contact.html` contains the enquiry form and contact details.
- `privacy-policy.html`, `terms-of-use.html`, `404.html`, `robots.txt`, and `sitemap.xml` support legal and SEO requirements.

## Run Locally

From the project root:

```bash
python3 -m http.server 8080
```

Open:

```text
http://127.0.0.1:8080
```

## Forms

The contact form posts to `/api/contact`, which forwards submissions to Web3Forms where the static host supports that endpoint. Set this environment variable before enabling production submissions:

```text
WEB3FORMS_ACCESS_KEY=your_web3forms_key
```

## SEO

The current canonical and sitemap URLs use:

```text
https://neptunetrading.lk/
```

Canonical URLs, Open Graph URLs, `robots.txt`, and `sitemap.xml` are configured for the production domain.

## Deployment

Upload the static files to the cPanel `public_html` directory for `https://neptunetrading.lk`. No build command is required.
# NeptuneTrading
# NeptuneTrading
