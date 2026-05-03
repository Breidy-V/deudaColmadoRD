import { Router } from 'express';
import { getMovimientosByDeuda } from '../controllers/movimientos.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyToken);

router.get('/deuda/:id', getMovimientosByDeuda);

export default router;