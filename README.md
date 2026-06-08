# Neptune Trading Company Website

Static corporate website for Neptune Trading Company (Pvt) Ltd. The site is built with plain HTML, CSS, and JavaScript for deployment through Vercel.

## Pages

- `index.html` is the homepage.
- `about.html` presents Neptune Trading Company as a separate trading entity.
- `what-we-do.html` explains sourcing, procurement, exports, and market-entry support.
- `principals.html` presents represented principal brands.
- `product-divisions.html` introduces HUMMER Power Products, , and Metal Alloys Corporation.
- `hummer-products.html` presents HUMMER product categories for B2B enquiry.
- `` presents  piping system categories for B2B enquiry.
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
http://localhost:8080
```

## Forms

The contact form posts to `/api/contact`, which forwards submissions to Web3Forms. Set this Vercel environment variable before enabling production submissions:

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

Create the GitHub repository as `Hikki-dev/NeptuneTrading`, push this project, and connect the repository to Vercel. No build command is required.
# NeptuneTrading
# NeptuneTrading
