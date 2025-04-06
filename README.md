# 🏓 HBS Ping Pong Tracker

Un'applicazione web per tracciare le partite di ping pong all'interno di HBS, gestire i giocatori e visualizzare le classifiche in tempo reale.
Tutto è stato sviluppato utilizzando Lovable e Cursor AI ed è hostato su Render.

## 📱 Funzionalità per l'Utente

### Gestione Giocatori
- Registrazione di nuovi giocatori
- Visualizzazione profilo giocatore con statistiche
- Classifica dei giocatori basata su vittorie e percentuale di successo

### Gestione Partite
- Registrazione rapida delle partite
- Storico delle partite recenti
- Visualizzazione dettagli partita

### Statistiche
- Classifica in tempo reale
- Percentuale vittorie per giocatore
- Numero totale partite giocate
- Punteggio totale accumulato

## 🛠 Specifiche Tecniche

### Frontend
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Routing**: React Router

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB
- **ORM**: Mongoose
- **API**: RESTful

### Architettura
```
/
├── client/               # Frontend React
│   ├── src/
│   │   ├── components/   # Componenti React
│   │   ├── pages/       # Pagine dell'applicazione
│   │   └── context/     # Context per state management
│   └── public/          # Asset statici
│
└── server/              # Backend Express
    ├── src/
    │   ├── controllers/ # Logic controllers
    │   ├── models/      # Mongoose models
    │   └── routes/      # API routes
    └── dist/            # Compiled TypeScript
```

## 🚀 Deployment

### Frontend
- Hosting: Render
- URL: https://hbs-ping-pong.onrender.com

### Backend
- Hosting: Render
- URL: https://hbs-ping-pong-server.onrender.com
- API Base URL: https://hbs-ping-pong-server.onrender.com/api

## 💻 Sviluppo Locale

### Prerequisiti
- Node.js (v18+)
- MongoDB
- Git

### Setup Frontend
```bash
cd client
npm install
npm run dev
```

### Setup Backend
```bash
cd server
npm install
npm run dev
```

### Variabili d'Ambiente

#### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

#### Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hbs-pingpong
CORS_ORIGINS=http://localhost:5173
```

## 📝 API Endpoints

### Players
- `GET /api/players` - Lista giocatori
- `GET /api/players/:id` - Dettagli giocatore
- `POST /api/players` - Crea giocatore
- `PUT /api/players/:id` - Aggiorna giocatore
- `GET /api/players/leaderboard` - Classifica

### Matches
- `GET /api/matches` - Lista partite
- `POST /api/matches` - Registra partita
- `GET /api/matches/:id` - Dettagli partita

## 👥 Contribuire
Per contribuire al progetto:
1. Fai un fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Committa i tuoi cambiamenti (`git commit -m 'Add some AmazingFeature'`)
4. Pusha sul branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza
Questo progetto è proprietario e ad uso esclusivo di Fabio Ubbiali