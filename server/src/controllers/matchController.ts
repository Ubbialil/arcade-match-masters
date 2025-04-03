import { Request, Response } from 'express';
import Match from '../models/Match';

export const getAllMatches = async (req: Request, res: Response) => {
  try {
    const matches = await Match.find()
      .populate('player1', '_id name avatar')
      .populate('player2', '_id name avatar')
      .sort({ playedAt: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero dei match' });
  }
};

export const getMatchById = async (req: Request, res: Response) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('player1', '_id name avatar')
      .populate('player2', '_id name avatar');
    if (!match) {
      return res.status(404).json({ message: 'Match non trovato' });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero del match' });
  }
};

export const createMatch = async (req: Request, res: Response) => {
  try {
    const { player1, player2, player1Score, player2Score, playedAt } = req.body;
    
    const match = new Match({
      player1,
      player2,
      player1Score,
      player2Score,
      playedAt: new Date(playedAt)
    });

    await match.save();
    
    // Popola i dati dei player prima di inviare la risposta
    const populatedMatch = await Match.findById(match._id)
      .populate('player1', '_id name avatar')
      .populate('player2', '_id name avatar');
      
    res.status(201).json(populatedMatch);
  } catch (error) {
    console.error('Errore nella creazione del match:', error);
    res.status(500).json({ message: 'Errore nella creazione del match' });
  }
};

export const updateMatch = async (req: Request, res: Response) => {
  try {
    const { player1Score, player2Score, playedAt } = req.body;
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ message: 'Match non trovato' });
    }

    match.player1Score = player1Score;
    match.player2Score = player2Score;
    match.playedAt = new Date(playedAt);

    await match.save();
    
    // Popola i dati dei player prima di inviare la risposta
    const updatedMatch = await Match.findById(match._id)
      .populate('player1', '_id name avatar')
      .populate('player2', '_id name avatar');
      
    res.json(updatedMatch);
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'aggiornamento del match' });
  }
};

export const deleteMatch = async (req: Request, res: Response) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match non trovato' });
    }
    res.json({ message: 'Match eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'eliminazione del match' });
  }
}; 