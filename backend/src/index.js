import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { generalLimiter } from './middleware/rateLimiter.js';
import aiRoutes from './routes/aiRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { isSupabaseConfigured } from './config/supabase.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. HTTP Security Headers
app.use(helmet());

// 2. CORS Configuration (supports local dev + Vercel deployments)
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin === CLIENT_URL ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:') ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. JSON Body Parsing
app.use(express.json({ limit: '1mb' }));

// 4. General Rate Limiting (100 requests per 15 mins)
app.use('/api', generalLimiter);

// 5. Health Check Route
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Artisan Brew AI Backend (Groq SDK)',
    supabaseMode: isSupabaseConfigured ? 'production' : 'local-seeded-fallback',
    timestamp: new Date().toISOString(),
  });
});

// 6. Primary API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// 7. 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} not found on Artisan Brew AI server.`,
  });
});

// 8. Global Error Handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled API Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Only listen on a local TCP port when not running inside Vercel Serverless
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(
      `[Artisan Brew AI] Server running on http://localhost:${PORT} (CORS allowed: ${CLIENT_URL})`
    );
  });
}

export default app;
