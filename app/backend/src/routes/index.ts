import { IRouter, Router } from 'express';
import teamRoutes from './teams.route';

const router: IRouter = Router();

router.use(teamRoutes);

export default router;
