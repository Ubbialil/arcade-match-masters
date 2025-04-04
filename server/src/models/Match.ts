import mongoose, { Schema, Document } from 'mongoose';
import { Player } from './Player';

export interface IMatch extends Document {
  player1: mongoose.Types.ObjectId;
  player2: mongoose.Types.ObjectId;
  player1Score: number;
  player2Score: number;
  playedAt: Date;
  status: 'scheduled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const matchSchema = new Schema({
  player1: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  player2: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  player1Score: {
    type: Number,
    required: true,
    default: 0
  },
  player2Score: {
    type: Number,
    required: true,
    default: 0
  },
  playedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed'],
    default: 'scheduled',
    required: true
  }
}, {
  timestamps: true
});

// Middleware per aggiornare le statistiche dei giocatori dopo il salvataggio di una partita
matchSchema.post('save', async function(doc) {
  // Determina il vincitore e il perdente
  const isPlayer1Winner = doc.player1Score > doc.player2Score;
  const winnerId = isPlayer1Winner ? doc.player1 : doc.player2;
  const loserId = isPlayer1Winner ? doc.player2 : doc.player1;
  const winnerScore = isPlayer1Winner ? doc.player1Score : doc.player2Score;
  const loserScore = isPlayer1Winner ? doc.player2Score : doc.player1Score;
  
  // Calcola la differenza di rating
  const winner = await Player.findById(winnerId);
  const loser = await Player.findById(loserId);
  
  if (winner && loser) {
    const ratingDiff = loser.rating - winner.rating;
    const kFactor = 32; // Fattore di apprendimento standard
    
    // Calcola il rating atteso (probabilità di vittoria)
    const expectedScore = 1 / (1 + Math.pow(10, ratingDiff / 400));
    
    // Calcola il nuovo rating del vincitore
    const winnerRatingChange = Math.round(kFactor * (1 - expectedScore));
    
    // Aggiorna le statistiche del vincitore
    await Player.findByIdAndUpdate(winnerId, {
      $inc: { 
        wins: 1,
        matchesPlayed: 1,
        rating: winnerRatingChange,
        pointsScored: winnerScore
      }
    });

    // Aggiorna le statistiche del perdente
    await Player.findByIdAndUpdate(loserId, {
      $inc: { 
        losses: 1,
        matchesPlayed: 1,
        rating: -winnerRatingChange,
        pointsScored: loserScore
      }
    });

    // Aggiorna il winRate per entrambi i giocatori
    await updateWinRate(winnerId);
    await updateWinRate(loserId);
  }
});

// Funzione helper per aggiornare il winRate
async function updateWinRate(playerId: mongoose.Types.ObjectId) {
  const player = await Player.findById(playerId);
  if (player) {
    const winRate = player.matchesPlayed > 0 
      ? (player.wins / player.matchesPlayed) * 100 
      : 0;
    
    await Player.findByIdAndUpdate(playerId, {
      winRate: winRate
    });
  }
}

export default mongoose.model<IMatch>('Match', matchSchema); 