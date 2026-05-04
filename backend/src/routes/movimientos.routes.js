import { Router } from 'express';
import { getAllMovimientos, getMovimientosDeuda } from '../controllers/movimientos.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyToken);

router.get('/', getAllMovimientos);
router.get('/deuda/:id', getMovimientosDeuda);

export default router;