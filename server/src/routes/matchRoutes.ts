import express from 'express';
import {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
} from '../controllers/matchController';

const router = express.Router();

router.get('/', getAllMatches);
router.get('/:id', getMatchById);
router.post('/', createMatch);
router.put('/:id', updateMatch);
router.delete('/:id', deleteMatch);

export default router; 