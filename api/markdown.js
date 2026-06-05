const PAGES = {
  "/": `# Neptune Trading Company

Connecting Sri Lankan buyers with trusted international product principals.

Neptune Trading represents selected international product manufacturers as their authorized local partner. We coordinate sourcing, procurement, and supply through our Colombo commercial desk since 1984.

## Three Authorized Product Divisions

Formal local agency agreements with global industrial manufacturers, covering inquiry routing, compliance documentation, and structured bid coordination.

### HUMMER Power Products

Authorized distributor for Sri Lanka & Maldives. Portable automotive and outdoor power solutions for fleet operators, workshops, emergency users, outdoor buyers, and corporate procurement teams.

More info: https://neptunetrading.lk/hummer-products.html

### Snow / Aliaxis Piping Systems

LESSO Snow brand solutions under the Aliaxis portfolio for commercial, infrastructure, drainage, plumbing, and fluid-management requirements.

More info: https://neptunetrading.lk/snow-aliaxis-products.html

### Metal Alloys Corporation

Technical copper, brass, bronze, and copper-nickel alloy products for marine, engineering, manufacturing, industrial maintenance, and project procurement requirements.

More info: https://neptunetrading.lk/metal-alloys-products.html

## Ceylon Export Support

For Ceylon tea and selected agricultural export enquiries, Neptune Trading works with CEC Commercial Export Company for export supply, product preparation, documentation support, and buyer fulfilment coordination.

## Four Core Capabilities

- **Represent** — Authorized product representation for selected international principals in Sri Lanka.
- **Source** — Supplier identification, pricing support, and technical procurement coordination.
- **Export** — Commercial export development for Ceylon tea and selected goods, backed by CEC where relevant.
- **Launch** — Market-entry coordination and regulatory setup compliance for brands entering Sri Lanka.

## Contact

Website: https://neptunetrading.lk/contact.html
Email: info@neptunetrading.lk
Established: 1984
Location: Colombo, Sri Lanka
`,
};

export default function handler(req, res) {
  const accept = req.headers["accept"] || "";
  const path = req.query.path || "/";

  if (!accept.includes("text/markdown")) {
    res.status(406).json({ error: "Not Acceptable — use Accept: text/markdown" });
    return;
  }

  const content = PAGES[path] || PAGES["/"];
  const tokens = content.split(/\s+/).length;

  res.setHeader("Content-Type", "text/markdown; charset=utf-8");
  res.setHeader("x-markdown-tokens", String(tokens));
  res.setHeader("Vary", "Accept");
  res.status(200).send(content);
}
