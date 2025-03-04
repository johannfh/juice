/** @type {import('next').NextApiHandler} */
export default async function handler(_req, res) {
  return res.status(405).json({ success: false, message: 'API MOVED' });
} 