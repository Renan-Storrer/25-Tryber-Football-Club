import { IRouter, Router } from 'express';

import verificaToken from '../middlewares/token.middleware';
import MatcheController from '../controllers/matches.controller';

const matcheController = new MatcheController();
const matcheRoutes: IRouter = Router();

matcheRoutes.get('/matches', matcheController.getAll.bind(matcheController));

matcheRoutes.patch(
  '/matches/:id/finish',
  verificaToken,
  matcheController.finished.bind(matcheController),
);

matcheRoutes.patch(
  '/matches/:id',
  verificaToken,
  matcheController.update.bind(matcheController),
);

matcheRoutes.post(
  '/matches',
  verificaToken,
  matcheController.create.bind(matcheController),
);

export default matcheRoutes;
