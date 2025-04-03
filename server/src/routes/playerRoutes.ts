import { Router } from 'express';
import { playerController } from '../controllers/playerController';

const router = Router();

router.get('/', playerController.getAllPlayers);
router.get('/leaderboard', playerController.getLeaderboard);
router.get('/:id', playerController.getPlayer);
router.post('/', playerController.createPlayer);
router.put('/:id', playerController.updatePlayer);
router.delete('/:id', playerController.deletePlayer);

export default router; 