import { Router } from 'express';
import { matchController } from '../controllers/matchController';

const router = Router();

router.get('/', matchController.getAllMatches);
router.get('/:id', matchController.getMatch);
router.get('/player/:playerId', matchController.getPlayerMatches);
router.post('/', matchController.createMatch);

export default router; 