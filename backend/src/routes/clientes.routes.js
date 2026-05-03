import { Router } from 'express';
import {
  createCliente,
  getClientes,
  getClienteById,
  updateCliente,
  deleteCliente
} from '../controllers/clientes.controller.js';

import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

// 🔐 proteger todo
router.use(verifyToken);

router.post('/', createCliente);
router.get('/', getClientes);
router.get('/:id', getClienteById);
router.put('/:id', updateCliente);
router.delete('/:id', deleteCliente);

export default router;