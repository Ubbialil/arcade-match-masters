import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Carica le variabili d'ambiente
dotenv.config();

// Versione corrente dell'applicazione
const CURRENT_VERSION = "001.002.000";

async function updatePlayers() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI non definita nel file .env');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connesso al database');
    
    const database = client.db('arcade-match-masters');
    
    // Verifica se la collezione versions esiste, altrimenti la crea
    const collections = await database.listCollections().toArray();
    const versionsExists = collections.some(col => col.name === 'versions');
    
    if (!versionsExists) {
      console.log('Creazione collezione versions...');
      await database.createCollection('versions');
      console.log('Collezione versions creata');
    }
    
    const versions = database.collection('versions');
    const players = database.collection('players');
    
    // Verifica la versione corrente del database
    const currentVersion = await versions.findOne({}, { sort: { _id: -1 } });
    
    if (!currentVersion || currentVersion.version < CURRENT_VERSION) {
      console.log(`Aggiornamento database da versione ${currentVersion?.version || 'non definita'} a ${CURRENT_VERSION}`);
      
      // Aggiorna tutti i documenti aggiungendo il campo disabled
      const result = await players.updateMany(
        {},
        { $set: { disabled: false } }
      );
      
      // Registra la nuova versione
      await versions.insertOne({
        version: CURRENT_VERSION,
        updatedAt: new Date(),
        changes: [
          {
            version: CURRENT_VERSION,
            date: new Date(),
            description: "Aggiunto campo disabled ai giocatori",
            changes: [
              "Aggiunto campo disabled con valore di default false a tutti i giocatori"
            ]
          }
        ]
      });
      
      console.log(`Aggiornati ${result.modifiedCount} documenti`);
      console.log(`Database aggiornato alla versione ${CURRENT_VERSION}`);
    } else {
      console.log(`Database già aggiornato alla versione ${currentVersion.version}`);
    }
    
  } catch (err) {
    console.error('Errore:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

updatePlayers(); 