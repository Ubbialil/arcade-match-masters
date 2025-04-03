import { Schema, model } from 'mongoose';

interface IPlayer {
  name: string;
  email: string;
  avatarUrl?: string;
  wins: number;
  losses: number;
  matchesPlayed: number;
  winRate: number;
  createdAt: Date;
  updatedAt: Date;
}

const playerSchema = new Schema<IPlayer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  matchesPlayed: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calcola automaticamente le statistiche prima del salvataggio
playerSchema.pre('save', function(next) {
  this.matchesPlayed = this.wins + this.losses;
  this.winRate = this.matchesPlayed > 0 ? (this.wins / this.matchesPlayed) * 100 : 0;
  next();
});

export const Player = model<IPlayer>('Player', playerSchema); 