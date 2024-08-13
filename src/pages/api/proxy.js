// pages/api/proxy.js
export default async function handler(req, res) {
    const { method, body } = req;
    console.log('body:', body);
  
    if (method !== 'POST') {
      return res.status(405).end(); // Method Not Allowed
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
  