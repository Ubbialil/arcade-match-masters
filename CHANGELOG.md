# Changelog

Tutte le modifiche significative a questo progetto verranno documentate in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e questo progetto aderisce a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [001.002.000] - 2024-03-21

### Aggiunto
- Sistema di versionamento del database
- Campo `disabled` per i giocatori
- Possibilità di disabilitare/abilitare i giocatori
- Giocatori disabilitati non appaiono nella classifica
- Giocatori disabilitati non appaiono nei dropdown per la creazione di nuovi match
- Script di aggiornamento automatico del database
- Verifica della versione del database all'avvio del server

### Modificato
- Stile delle select dei giocatori per migliorare la leggibilità su desktop
- Gestione dei punteggi nella creazione dei match per evitare il pareggio
- Formattazione dei campi numerici per evitare lo 0 iniziale

### Corretto
- Aggiornamento delle statistiche dei giocatori quando viene eliminato un match
- Gestione degli errori nella connessione al database 