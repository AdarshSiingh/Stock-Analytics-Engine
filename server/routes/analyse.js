
import express from 'express';
import { runPython } from '../utils/runPython.js';

const router = express.Router();

router.get('/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const { range = '6mo' } = req.query;

  if (!/^[A-Za-z]{1,10}$/.test(ticker)) {
    return res.status(400).json({ error: 'Invalid ticker symbol' });
  }

  try {
    const data = await runPython('run.py', [ticker, range]);
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;