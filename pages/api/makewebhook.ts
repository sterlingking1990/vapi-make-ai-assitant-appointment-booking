// /pages/api/webhook.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // Make.com webhook URL
    const makeWebhookUrl = "https://hook.eu2.make.com/jtzu58bwpfwmf3vre4cm3jko97fqv9td";

    // Send data to Make.com webhook
    const response = await fetch(makeWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
      throw new Error("Failed to send data to webhook");
    }
    const responseText = await response.text(); // Get raw response text
    console.log("Raw response:", responseText);


    let data;
  try {
    data = JSON.parse(responseText); // Manually parse JSON
    console.log("Parsed data:", data);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return res.status(500).json({ message: "Failed to parse JSON response" });
  }

  // Return the Make.com response to the frontend
  return res.status(200).json(data); 
  } catch (error: any) {
    console.error("Error in webhook handler:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
