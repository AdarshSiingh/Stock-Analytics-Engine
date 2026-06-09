import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import analyseRouter from './routes/analyse.js';
dotenv.config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://stock-analytics-engine.vercel.app'
  ]
}));
app.use(express.json());

app.use('/api/analyse', analyseRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.get('/api/debug', (req, res) => {
  exec('which python3 && python3 --version', (err, stdout, stderr) => {
    res.json({
      stdout,
      stderr,
      err: err?.message,
      pythonPath: process.env.PYTHON_PATH
    });
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));