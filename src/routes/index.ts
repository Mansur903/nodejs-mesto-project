import { Router } from 'express';
import cardsRouter from './cards';
import usersRouter from './users';

const router = Router();

router.use(usersRouter);
router.use(cardsRouter);

export default router;
