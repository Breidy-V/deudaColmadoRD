import express, { json } from 'express';
const app = express();

app.use(json());

import userRoutes from './routes/users';
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});