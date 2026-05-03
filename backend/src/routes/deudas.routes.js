import { Router } from 'express';
import {
  createDeuda,
  getDeudas,
  getDeudaById,
  deleteDeuda
} from '../controllers/deudas.controller.js';

import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyToken);

router.post('/', createDeuda);
router.get('/', getDeudas);
router.get('/:id', getDeudaById);
router.delete('/:id', deleteDeuda);

export default router;