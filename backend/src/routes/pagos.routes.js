import { Router } from 'express';
import {
  createPago,
  getPagos,
  getPagosByDeudaController,
  deletePago
} from '../controllers/pagos.controller.js';

import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyToken);

router.post('/', createPago);
router.get('/', getPagos);
router.get('/deuda/:id', getPagosByDeudaController);
router.delete('/:id', deletePago);

export default router;