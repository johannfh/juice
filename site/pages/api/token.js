/** @type {import('next').NextApiHandler} */
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  const { content } = req.query;

  if (!content) {
    return res.status(400).json({
      success: false,
      message: 'Content parameter is required',
    });
  }

  // Set headers for raw file download without extension
  res.setHeader('Content-Disposition', 'attachment; filename=token');
  res.setHeader('Content-Type', 'application/octet-stream');
  
  // Send the content as the response
  res.send(content);
} 