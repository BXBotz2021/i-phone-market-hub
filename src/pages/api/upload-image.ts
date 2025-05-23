// pages/api/upload-image.ts
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new formidable.IncomingForm({
      uploadDir,
      keepExtensions: true,
      filename: (name, ext) => `${Date.now()}-${name}${ext}`,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(500).json({ 
          message: err.message.includes('maxFileSize') 
            ? 'File too large (max 10MB)' 
            : 'Upload failed' 
        });
      }

      const file = files.image as formidable.File;
      if (!file) {
        return res.status(400).json({ message: 'No image provided' });
      }

      // Return the public URL of the uploaded file
      const publicUrl = `/uploads/${path.basename(file.filepath)}`;
      return res.status(200).json({ url: publicUrl });
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
