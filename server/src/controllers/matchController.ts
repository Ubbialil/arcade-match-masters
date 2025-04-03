import { Request, Response } from 'express';
import { Match } from '../models/Match';
import { Player } from '../models/Player';

export const matchController = {
  // Ottieni tutte le partite
  getAllMatches: async (req: Request, res: Response) => {
    try {
      const matches = await Match.find()
        .populate('player1', 'name avatarUrl')
        .populate('player2', 'name avatarUrl')
        .populate('winner', 'name')
        .populate('loser', 'name')
        .sort({ date: -1 });
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: 'Errore nel recupero delle partite', error });
    }
  },

  // Ottieni una partita specifica
  getMatch: async (req: Request, res: Response) => {
    try {
      const match = await Match.findById(req.params.id)
        .populate('player1', 'name avatarUrl')
        .populate('player2', 'name avatarUrl')
        .populate('winner', 'name')
        .populate('loser', 'name');
      if (!match) {
        return res.status(404).json({ message: 'Partita non trovata' });
      }
      res.json(match);
    } catch (error) {
      res.status(500).json({ message: 'Errore nel recupero della partita', error });
    }
  },

  // Crea una nuova partita
  createMatch: async (req: Request, res: Response) => {
    try {
      const { player1Id, player2Id, score } = req.body;

      // Verifica che i giocatori esistano
      const [player1, player2] = await Promise.all([
        Player.findById(player1Id),
        Player.findById(player2Id)
      ]);

      if (!player1 || !player2) {
        return res.status(404).json({ message: 'Uno o entrambi i giocatori non trovati' });
      }

      // Determina vincitore e perdente
      const winner = score.player1 > score.player2 ? player1Id : player2Id;
      const loser = score.player1 > score.player2 ? player2Id : player1Id;

      const match = new Match({
        player1: player1Id,
        player2: player2Id,
        winner,
        loser,
        score: {
          player1: score.player1,
          player2: score.player2
        }
      });

      await match.save();
      
      const populatedMatch = await Match.findById(match._id)
        .populate('player1', 'name avatarUrl')
        .populate('player2', 'name avatarUrl')
        .populate('winner', 'name')
        .populate('loser', 'name');

      res.status(201).json(populatedMatch);
    } catch (error) {
      res.status(400).json({ message: 'Errore nella creazione della partita', error });
    }
  },

  // Ottieni le partite di un giocatore specifico
  getPlayerMatches: async (req: Request, res: Response) => {
    try {
      const playerId = req.params.playerId;
      const matches = await Match.find({
        $or: [{ player1: playerId }, { player2: playerId }]
      })
        .populate('player1', 'name avatarUrl')
        .populate('player2', 'name avatarUrl')
        .populate('winner', 'name')
        .populate('loser', 'name')
        .sort({ date: -1 });
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: 'Errore nel recupero delle partite del giocatore', error });
    }
  }
}; 