import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// ============ MIDDLEWARE CORS ============
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============ MIDDLEWARE JSON ============
app.use(express.json());

// ============ RUTA RAÍZ (OPCIONAL) ============
app.get('/', (req, res) => {
  res.json({ mensaje: 'API FiadoRD funcionando correctamente' });
});

// ============ RUTAS ============
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// ============ PUERTO ============
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});