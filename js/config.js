/**
 * LOGIKRON - Configurazione Centralizzata
 * ========================================
 * Questo file contiene tutte le configurazioni del sistema.
 * Modificare qui per cambiare anno scolastico o agganciare altre scuole.
 */

const LOGIKRON_CONFIG = {
  // ==========================================
  // ANNO SCOLASTICO CORRENTE
  // ==========================================
  annoScolastico: '2025-2026',

  // ==========================================
  // GOOGLE APPS SCRIPT - WEB APP URLs
  // ==========================================
  // Questi URL vengono generati dopo il deploy degli script
  webAppUrls: {
    intenzioni: '',      // Da compilare dopo deploy
    iscrizioni: '',      // Da compilare dopo deploy (ex LogiKron2025)
    gare: '',            // Da compilare dopo deploy
    admin: ''            // Da compilare dopo deploy
  },

  // ==========================================
  // GOOGLE DRIVE - CARTELLE
  // ==========================================
  // Proprietà: animatoredigitale@icgottolengo.edu.it
  // Condiviso con: fabiorizzotto75@gmail.com
  drive: {
    // Cartella root LogiKron nel Drive di animatore
    rootFolderId: '',    // Da compilare: ID cartella /LogiKron/

    // Cartella anno corrente (creata automaticamente)
    annoFolderId: '',    // Da compilare: ID cartella /LogiKron/2025-2026/

    // Sheet Master con tutti i dati
    sheetMasterId: '',   // Da compilare: ID dello Sheet Master
  },

  // ==========================================
  // CONFIGURAZIONE GARE
  // ==========================================
  gare: {
    // Parametri di default (modificabili da admin)
    durataMinuti: 90,
    numeroDomande: 15,
    puntiIniziali: 20,
    incrementoPuntiOgniMinuti: 2,
    penalitaRispostaSbagliata: -10,
    bonusProblemaPenalita: 2,
    tempoJollyMinuti: 5,

    // Bonus posizionamento (primi 10 a risolvere)
    bonusPosizionamento: [20, 15, 10, 8, 6, 5, 4, 3, 2, 1],

    // Bonus completamento (primi 6 a completare tutti)
    bonusCompletamento: [100, 60, 40, 30, 20, 10],

    // Formato risposte
    formatoRisposte: '0000-9999'  // Numeri interi 4 cifre
  },

  // ==========================================
  // ISTITUTI COMPRENSIVI PARTECIPANTI
  // ==========================================
  // Questo array viene aggiornato automaticamente
  // dalla App Intenzioni quando i docenti si iscrivono
  istituti: [
    {
      nome: "IC Gottolengo",
      plessi: [
        { nome: "Gottolengo", sigla: "GT" },
        { nome: "Gambara", sigla: "GM" },
        { nome: "Fiesse", sigla: "FS" }
      ]
    },
    {
      nome: "IC Calvisano",
      plessi: [
        { nome: "Calvisano", sigla: "CV" },
        { nome: "Isorella", sigla: "IS" },
        { nome: "Viadana", sigla: "VD" }
      ]
    },
    {
      nome: "IC Pralboino",
      plessi: [
        { nome: "Pralboino", sigla: "PR" },
        { nome: "Pavone del Mella", sigla: "PV" },
        { nome: "Milzano", sigla: "ML" },
        { nome: "Cigole", sigla: "CG" },
        { nome: "Seniga", sigla: "SN" }
      ]
    },
    {
      nome: "IC Ghedi",
      plessi: [
        { nome: "Ghedi", sigla: "GH" }
      ]
    },
    {
      nome: "IC Verolanuova",
      plessi: [
        { nome: "Verolanuova", sigla: "VN" },
        { nome: "Verolavecchia", sigla: "VV" },
        { nome: "Bassano Bresciano", sigla: "BB" },
        { nome: "Cadignano", sigla: "CD" }
      ]
    },
    {
      nome: "IC Orzinuovi",
      plessi: [
        { nome: "Orzinuovi", sigla: "OR" },
        { nome: "Orzivecchi", sigla: "OV" },
        { nome: "Pompiano", sigla: "PM" },
        { nome: "Villachiara", sigla: "VC" }
      ]
    }
  ],

  // ==========================================
  // CLASSI AMMESSE
  // ==========================================
  classi: {
    primaria: [
      { nome: "3^", codice: "3" },
      { nome: "4^", codice: "4" },
      { nome: "5^", codice: "5" },
      { nome: "Pluriclasse 3^-4^", codice: "3P" },
      { nome: "Pluriclasse 4^-5^", codice: "4P" }
    ],
    secondaria: [
      { nome: "1^", codice: "1S" },
      { nome: "2^", codice: "2S" },
      { nome: "3^", codice: "3S" }
    ]
  },

  // ==========================================
  // TEMPLATE ATTESTATI
  // ==========================================
  attestati: {
    templateDocId: '',   // Da compilare: ID del Google Doc template
    meriti: {
      vincitore: 'Merito',
      partecipante: 'Partecipazione'
    }
  },

  // ==========================================
  // ADMIN
  // ==========================================
  admin: {
    // Password per accesso pagina admin (hash SHA-256)
    // Generare con: CryptoJS.SHA256('tuapassword').toString()
    passwordHash: '',

    // Email admin per notifiche
    emailAdmin: 'fabiorizzotto75@gmail.com'
  }
};

// Esporta per uso in altri moduli
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LOGIKRON_CONFIG;
}
