// pages/api/proxy.js

export default async function handler(req, res) {
  const { method, body, headers } = req;

  if (method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  // Ensure the request came from the same site
  const origin = headers.origin || headers.referer;
  if (!origin || !origin.includes(process.env.NEXT_PUBLIC_BASE_URL)) {
    return res.status(403).json({ message: 'Forbidden' }); // Forbidden
  }

  // Validate body
  if (!body || !body.endpoint || !body.token) {
    return res.status(400).json({ message: 'Bad Request: Missing required parameters' });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api${body.endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${body.token}`,
        'X-Internal-Token': process.env.NEXT_PUBLIC_INTERNAL_SECRET_TOKEN,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
