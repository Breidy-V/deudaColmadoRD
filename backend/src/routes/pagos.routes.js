import { Router } from 'express';
import {
  createPago,
  getPagos,
  getPagosByDeuda,
  deletePago
} from '../controllers/pagos.controller.js';

import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyToken);

router.post('/', createPago);
router.get('/', getPagos);
router.get('/deuda/:id', getPagosByDeuda);
router.delete('/:id', deletePago);

export default router;