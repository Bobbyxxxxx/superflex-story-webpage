import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import Grid from 'gridfs-stream';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const conn = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => ({
    filename: `${Date.now()}-${file.originalname}`,
    bucketName: 'uploads',
  }),
});
const upload = multer({ storage });
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({
    message: 'Upload successful',
    imageUrl: `/image/${req.file.filename}`,
  });
});
app.get('/image/:filename', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.set('Content-Type', file.contentType);
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving file', error: err });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
