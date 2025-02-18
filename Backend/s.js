import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'my_images' },
      (error, result) => {
        if (error) return res.status(500).json({ message: 'Upload failed', error });

        res.json({
          message: 'Upload successful',
          imageUrl: result.secure_url,
        });
      }
    );

    result.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error });
  }
});

app.get('/random-images', async (req, res) => {
    try {
      const response = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'my_images/',
        max_results: 100 
      });
  
      const images = response.resources;
      if (!images || images.length === 0) {
        return res.json({ message: 'No images found' });
      }
  
      // Shuffle and return 20 images
      const shuffled = images.sort(() => 0.5 - Math.random());
      const randomImages = shuffled.slice(0, 20).map(img => img.secure_url);
  
      res.json({ images: randomImages });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching images', error });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
