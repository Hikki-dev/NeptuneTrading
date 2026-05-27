export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ success: false, message: "Method not allowed" });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return response.status(500).json({ success: false, message: "Form service is not configured" });
  }

  try {
    const fields = request.body && typeof request.body === "object" ? request.body : {};
    const payload = {
      access_key: accessKey,
      subject: fields.subject || "Neptune Trading Company Website Enquiry",
      from_name: fields.name || "Neptune Trading Website",
      name: fields.name || "",
      company: fields.company || "",
      email: fields.email || "",
      phone: fields.phone || "",
      principal: fields.principal || "",
      message: fields.message || "",
      botcheck: fields.botcheck || ""
    };

    const web3formsResponse = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await web3formsResponse.json();
    return response.status(web3formsResponse.ok ? 200 : 502).json(result);
  } catch (error) {
    return response.status(500).json({ success: false, message: "Unable to submit enquiry" });
  }
}
