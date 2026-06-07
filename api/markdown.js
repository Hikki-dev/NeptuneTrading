function stripTags(html) {
  return html.replace(/<[^>]+>/g, "");
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&thinsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function htmlToMarkdown(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);

  const title = titleMatch ? decodeEntities(titleMatch[1].trim()) : "";
  const description = descMatch ? decodeEntities(descMatch[1].trim()) : "";

  let frontmatter = "---\n";
  if (title) frontmatter += `title: "${title.replace(/"/g, '\\"')}"\n`;
  if (description) frontmatter += `description: "${description.replace(/"/g, '\\"')}"\n`;
  frontmatter += "---\n\n";

  // Strip non-content blocks
  let body = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // Prefer <main> content if present
  const mainMatch = body.match(/<main[\s\S]*?>([\s\S]*?)<\/main>/i);
  if (mainMatch) body = mainMatch[1];

  // Headings
  for (let i = 6; i >= 1; i--) {
    const hashes = "#".repeat(i);
    body = body.replace(
      new RegExp(`<h${i}[^>]*>([\\s\\S]*?)<\/h${i}>`, "gi"),
      (_, t) => `\n${hashes} ${decodeEntities(stripTags(t).trim())}\n`
    );
  }

  // Links (before stripping tags)
  body = body.replace(
    /<a[^>]+href=["']([^"'#][^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, text) => {
      const clean = decodeEntities(stripTags(text).trim());
      return clean ? `[${clean}](${href})` : "";
    }
  );
  // Anchor-only links - just keep text
  body = body.replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, (_, t) => decodeEntities(stripTags(t).trim()));

  // Bold / italic
  body = body
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, t) => `**${decodeEntities(stripTags(t).trim())}**`)
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, (_, t) => `**${decodeEntities(stripTags(t).trim())}**`)
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, t) => `_${decodeEntities(stripTags(t).trim())}_`)
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, (_, t) => `_${decodeEntities(stripTags(t).trim())}_`);

  // Lists
  body = body.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `- ${decodeEntities(stripTags(t).trim())}\n`);
  body = body.replace(/<\/?(ul|ol)[^>]*>/gi, "\n");

  // Table rows to plain text
  body = body.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, (_, t) => `${decodeEntities(stripTags(t).trim())}\n`);
  body = body.replace(/<\/?(table|thead|tbody|tfoot)[^>]*>/gi, "\n");

  // Paragraphs and divs
  body = body.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => {
    const clean = decodeEntities(stripTags(t).trim());
    return clean ? `\n${clean}\n` : "";
  });
  body = body.replace(/<br\s*\/?>/gi, "\n");
  body = body.replace(/<\/(div|section|article|aside)[^>]*>/gi, "\n");

  // Strip any remaining tags
  body = stripTags(body);
  body = decodeEntities(body);

  // Normalise whitespace
  body = body
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return frontmatter + body;
}

export default async function handler(req, res) {
  const accept = req.headers["accept"] || "";

  if (!accept.includes("text/markdown")) {
    res.status(406).json({ error: "Not Acceptable — use Accept: text/markdown" });
    return;
  }

  let path = req.query.path || "/";
  if (!path.startsWith("/")) path = "/" + path;
  // Strip markdown-handler path to avoid loops
  if (path.startsWith("/api/")) {
    res.status(400).json({ error: "Cannot convert API routes" });
    return;
  }

  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["host"];
  const origin = `${protocol}://${host}`;

  let html;
  try {
    const response = await fetch(`${origin}${path}`, {
      headers: { accept: "text/html", "user-agent": "markdown-negotiation/1.0" },
    });
    if (!response.ok) {
      res.status(response.status).json({ error: `Upstream returned ${response.status}` });
      return;
    }
    html = await response.text();
  } catch (err) {
    res.status(502).json({ error: "Failed to fetch page" });
    return;
  }

  const markdown = htmlToMarkdown(html);
  const tokens = markdown.split(/\s+/).filter(Boolean).length;

  res.setHeader("Content-Type", "text/markdown; charset=utf-8");
  res.setHeader("x-markdown-tokens", String(tokens));
  res.setHeader("Vary", "Accept");
  res.status(200).send(markdown);
}
