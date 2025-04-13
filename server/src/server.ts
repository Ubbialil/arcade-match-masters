import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import playerRoutes from './routes/playerRoutes';
import matchRoutes from './routes/matchRoutes';
import { APP_VERSION, DatabaseVersion } from './config/version';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);

// Verifica versione database all'avvio
async function checkDatabaseVersion() {
  try {
    const versions = mongoose.connection.db.collection('versions');
    const currentVersion = await versions.findOne({}, { sort: { _id: -1 } }) as DatabaseVersion | null;

    if (!currentVersion || currentVersion.version < APP_VERSION) {
      console.log(`⚠️ Database non aggiornato. Versione corrente: ${currentVersion?.version || 'non definita'}, Versione richiesta: ${APP_VERSION}`);
      console.log('Esegui lo script di aggiornamento: npm run update-db');
    } else {
      console.log(`✅ Database aggiornato alla versione ${currentVersion.version}`);
    }
  } catch (error) {
    console.error('Errore durante la verifica della versione del database:', error);
  }
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arcade-match-masters')
  .then(() => {
    console.log('Connected to MongoDB');
    checkDatabaseVersion();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 