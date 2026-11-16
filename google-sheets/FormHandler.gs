/**
 * Marco Turconi - modulo analisi gratuita -> Google Fogli.
 * Distribuire come "Applicazione web" eseguita come proprietario, accessibile a Chiunque.
 * Inserire l'URL .../exec nel form di index.html al posto dell'action FormSubmit.
 *
 * Nota: endpoint pubblico, applicare protezioni antispam se necessario.
 */
const SPREADSHEET_ID = '13i-nNDpGadLSxKiNPTOsr5gm_hWhOcvzGXXBGvpn3qw';
const WORKSHEET_NAME = 'Richieste sito';
const NOTIFICATION_EMAIL = 'marcoturc2@gmail.com';
const COLUMNS = [
  'Data e ora', 'Nome', 'Cognome', 'Email', 'Telefono',
  'Modalità di contatto', 'Interesse', 'Messaggio', 'Origine'
];

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p._honey) return resultPage('Richiesta ricevuta.', true);

  // Non riceviamo né salviamo password, portafogli o documenti.
  const required = ['Nome','Cognome','Email','Telefono','Modalita di contatto'];
  for (const key of required) {
    if (!String(p[key] || '').trim()) return resultPage('Completa i campi obbligatori.', false);
  }
  const mail = String(p.Email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return resultPage('Indirizzo email non valido.', false);
  if (p['Conferma lettura informativa'] !== 'Si') return resultPage('Devi confermare la lettura dell’informativa.', false);

  const safe = (value, maxLen) => {
    let s = String(value || '').trim().slice(0, maxLen).replace(/[\u0000-\u001F]/g, ' ');
    // Evita interpretazioni come formule all'interno del foglio.
    return /^[=+\-@]/.test(s) ? "'" + s : s;
  };

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(25000)) return resultPage('Servizio temporaneamente occupato. Riprova.', false);
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sh = ss.getSheetByName(WORKSHEET_NAME);
    if (!sh) sh = ss.insertSheet(WORKSHEET_NAME);
    if (sh.getLastRow() === 0) sh.appendRow(COLUMNS);
    const row = [
      new Date(), safe(p.Nome,80), safe(p.Cognome,80), safe(mail,150),safe(p.Telefono,30),
      safe(p['Modalita di contatto'],50), safe(p.Interesse,130),safe(p.Messaggio,600),
      'marcoturconicfa.it'
    ];
    sh.appendRow(row);

    // La registrazione è già avvenuta: un eventuale errore email non deve
    // indurre l'utente a ripetere l'invio, duplicando il contatto nel foglio.
    try {
      MailApp.sendEmail({
        to: NOTIFICATION_EMAIL,
        subject: 'Nuovo contatto dal sito - Marco Turconi',
        body: [
          'È arrivata una nuova richiesta di analisi gratuita.',
          '',
          'Data: ' + Utilities.formatDate(row[0], Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm'),
          'Nome: ' + String(p.Nome || '').trim(),
          'Cognome: ' + String(p.Cognome || '').trim(),
          'Email: ' + mail,
          'Telefono: ' + String(p.Telefono || '').trim(),
          'Ricontattare via: ' + String(p['Modalita di contatto'] || '').trim(),
          'Interesse: ' + String(p.Interesse || '').trim(),
          'Messaggio: ' + String(p.Messaggio || '').trim(),
          '',
          'Visualizza i contatti:',
          'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '/edit'
        ].join('\n')
      });
    } catch (emailError) {
      console.error('Contatto registrato, ma notifica email non inviata: ' + emailError);
    }
  } catch (err) {
    console.error('Errore salvataggio richiesta: ' + err);
    return resultPage('Non è stato possibile inviare la richiesta. Riprova più tardi.', false);
  } finally {
    lock.releaseLock();
  }
  return resultPage('Grazie! La tua richiesta è stata ricevuta. Ti ricontatterò presto.', true);
}

function resultPage(message, ok) {
  const safeMessage = String(message).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const title = ok ? 'Richiesta inviata' : 'Invio non completato';
  return HtmlService.createHtmlOutput(
    '<!doctype html><html lang="it"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<title>'+title+'</title><body style="font-family:system-ui;background:#092734;color:#fff;min-height:100vh;display:grid;place-items:center;margin:0">'+
    '<main style="padding:42px;max-width:570px;text-align:center"><h1>'+title+'</h1><p>'+safeMessage+'</p>'+
    '<a style="color:#e4c49b" href="https://marcoturconicfa.it/">Torna al sito</a></main></body></html>'
  );
}