const { MongoClient } = require('mongodb');

// Sostituisci con la tua stringa di connessione
const uri = "mongodb+srv://your-connection-string";

// Versione corrente dell'applicazione
const CURRENT_VERSION = "001.002.000";

async function updatePlayers() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connesso al database');
    
    const database = client.db('arcade-match-masters');
    const versions = database.collection('versions');
    const players = database.collection('players');
    
    // Verifica la versione corrente del database
    const currentVersion = await versions.findOne({}, { sort: { _id: -1 } });
    
    if (!currentVersion || currentVersion.version < CURRENT_VERSION) {
      console.log(`Aggiornamento database da versione ${currentVersion?.version || 'non definita'} a ${CURRENT_VERSION}`);
      
      // Aggiorna tutti i documenti aggiungendo il campo disabled
      const result = await players.updateMany(
        { disabled: { $exists: false } },
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
  } finally {
    await client.close();
  }
}

updatePlayers(); 