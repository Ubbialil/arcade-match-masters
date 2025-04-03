import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  player1: mongoose.Types.ObjectId;
  player2: mongoose.Types.ObjectId;
  player1Score: number;
  player2Score: number;
  playedAt: Date;
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
  }
}, {
  timestamps: true
});

// Middleware per aggiornare le statistiche dei giocatori dopo il salvataggio di una partita
matchSchema.post('save', async function(doc) {
  const { Player } = require('./Player');
  
  // Determina il vincitore e il perdente
  const isPlayer1Winner = doc.player1Score > doc.player2Score;
  
  // Aggiorna le statistiche del vincitore
  await Player.findByIdAndUpdate(isPlayer1Winner ? doc.player1 : doc.player2, {
    $inc: { 
      wins: 1,
      rating: 25 // Aumenta il rating del vincitore
    }
  });

  // Aggiorna le statistiche del perdente
  await Player.findByIdAndUpdate(isPlayer1Winner ? doc.player2 : doc.player1, {
    $inc: { 
      losses: 1,
      rating: -15 // Diminuisce il rating del perdente
    }
  });
});

export default mongoose.model<IMatch>('Match', matchSchema); 