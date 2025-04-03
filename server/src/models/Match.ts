import { Schema, model, Types } from 'mongoose';

interface IMatch {
  player1: Types.ObjectId;
  player2: Types.ObjectId;
  winner: Types.ObjectId;
  loser: Types.ObjectId;
  score: {
    player1: number;
    player2: number;
  };
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const matchSchema = new Schema<IMatch>({
  player1: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  player2: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  winner: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  loser: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  score: {
    player1: { type: Number, required: true },
    player2: { type: Number, required: true }
  },
  date: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Middleware per aggiornare le statistiche dei giocatori dopo il salvataggio di una partita
matchSchema.post('save', async function(doc) {
  const { Player } = require('./Player');
  
  // Aggiorna le statistiche del vincitore
  await Player.findByIdAndUpdate(doc.winner, {
    $inc: { wins: 1 }
  });

  // Aggiorna le statistiche del perdente
  await Player.findByIdAndUpdate(doc.loser, {
    $inc: { losses: 1 }
  });
});

export const Match = model<IMatch>('Match', matchSchema); 