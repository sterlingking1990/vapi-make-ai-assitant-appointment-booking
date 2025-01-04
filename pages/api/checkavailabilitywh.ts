import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { specialty, day, time } = req.body;

  if (!specialty || !day || !time) {
    return res.status(400).json({
      message: "Missing required parameters. Please provide specialty, date, and time.",
    });
  }

  const webhookUrl = "https://hook.eu2.make.com/q3s2phxirwkk5b82q8k13o40yximc1ox";

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ specialty, day, time }),
    });

    // Log response status for debugging
    console.log("Webhook response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Webhook error response:", errorText);
      return res.status(response.status).json({
        message: "Failed to send data to webhook",
        error: errorText,
      });
    }

    const responseText = await response.text();
    console.log("Raw response:", responseText);

    let data;
    try {
      data = JSON.parse(responseText); // Manually parse JSON
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res.status(500).json({
        message: "Failed to parse JSON response from webhook",
        rawResponse: responseText,
      });
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error in webhook handler:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
