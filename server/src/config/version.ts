export const APP_VERSION = "001.002.000";

export interface DatabaseVersion {
  version: string;
  updatedAt: Date;
  changes: {
    version: string;
    date: Date;
    description: string;
    changes: string[];
  }[];
}

export const VERSION_CHANGES: Record<string, () => Promise<void>> = {
  "001.002.000": async () => {
    // Aggiornamenti per la versione 001.002.000
    // Aggiungere qui le funzioni di aggiornamento specifiche per questa versione
  }
}; 