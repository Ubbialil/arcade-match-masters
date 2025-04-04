import { Request, Response } from 'express';
import { Player } from '../models/Player';

export const playerController = {
  // Ottieni tutti i giocatori
  getAllPlayers: async (req: Request, res: Response) => {
    try {
      const players = await Player.find().sort({ winRate: -1 });
      res.json(players);
    } catch (error) {
      res.status(500).json({ message: 'Errore nel recupero dei giocatori', error });
    }
  },

  // Ottieni un giocatore specifico
  getPlayer: async (req: Request, res: Response) => {
    try {
      const player = await Player.findById(req.params.id);
      if (!player) {
        return res.status(404).json({ message: 'Giocatore non trovato' });
      }
      res.json(player);
    } catch (error) {
      res.status(500).json({ message: 'Errore nel recupero del giocatore', error });
    }
  },

  // Crea un nuovo giocatore
  createPlayer: async (req: Request, res: Response) => {
    try {
      const { name, email, password, avatarUrl } = req.body;
      
      // Validazione dei campi obbligatori
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Nome, email e password sono obbligatori' });
      }

      const player = new Player({
        name,
        email,
        password,
        avatarUrl,
        rating: 1000, // Rating iniziale
        wins: 0,
        losses: 0,
        matchesPlayed: 0,
        winRate: 0,
        pointsScored: 0
      });

      await player.save();
      res.status(201).json(player);
    } catch (error) {
      res.status(400).json({ message: 'Errore nella creazione del giocatore', error });
    }
  },

  // Aggiorna un giocatore
  updatePlayer: async (req: Request, res: Response) => {
    try {
      const player = await Player.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      if (!player) {
        return res.status(404).json({ message: 'Giocatore non trovato' });
      }
      res.json(player);
    } catch (error) {
      res.status(400).json({ message: 'Errore nell\'aggiornamento del giocatore', error });
    }
  },

  // Elimina un giocatore
  deletePlayer: async (req: Request, res: Response) => {
    try {
      const player = await Player.findByIdAndDelete(req.params.id);
      if (!player) {
        return res.status(404).json({ message: 'Giocatore non trovato' });
      }
      res.json({ message: 'Giocatore eliminato con successo' });
    } catch (error) {
      res.status(500).json({ message: 'Errore nell\'eliminazione del giocatore', error });
    }
  },

  // Ottieni la classifica dei giocatori
  getLeaderboard: async (req: Request, res: Response) => {
    try {
      const leaderboard = await Player.find()
        .sort({ winRate: -1, wins: -1 })
        .limit(10);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: 'Errore nel recupero della classifica', error });
    }
  }
}; 