import { Router } from 'express';
import { register, listUsers } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', register);
router.get('/', verifyToken, listUsers);

export default router;