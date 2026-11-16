# Attivazione del modulo verso Google Fogli

**Destinazione:** [Google Fogli delle richieste](https://docs.google.com/spreadsheets/d/13i-nNDpGadLSxKiNPTOsr5gm_hWhOcvzGXXBGvpn3qw/edit)

Il link di un Google Fogli **non è** di per sé un endpoint di ricezione dei moduli HTML. Il file `google-sheets/FormHandler.gs` è pronto per usare Google Apps Script come ponte; bisogna ancora pubblicarlo dal proprio account Google, che ha accesso di modifica al foglio.

## Unica attivazione necessaria

1. Apri il Google Fogli indicato sopra, con un account che possa modificarlo.
2. Vai in **Estensioni → Apps Script**.
3. Sostituisci il contenuto di `Code.gs` con quello del file [FormHandler.gs](google-sheets/FormHandler.gs) di questo repository e salva.
4. Da Apps Script scegli **Distribuisci → Nuova distribuzione → Applicazione web**.
5. Imposta **Esegui come: Me** e **Chi ha accesso: Chiunque**. Conferma le autorizzazioni richieste per scrivere nel foglio.
6. Copia l'URL di distribuzione che termina con `/exec` e invialo nella chat per completare l'integrazione del sito.
7. Dopo la configurazione faremo una prova: una riga deve comparire nella scheda `Richieste sito`.

## Cosa registra

Data e ora, nome, cognome, email, telefono, modalità di ricontatto, interesse, messaggio e origine del modulo. La scheda `Richieste sito` viene creata automaticamente alla prima richiesta.

**Protezione dei dati:** il modulo raccoglie informazioni personali e sarà necessario allineare l'informativa privacy e verificare con IoInvesto SCF i trattamenti e i soggetti coinvolti. L'applicazione web sarà pubblica, perché deve accettare richieste anche da visitatori non autenticati. Prima di campagne su larga scala è raccomandata una protezione antispam adeguata.

## Stato

In attesa dell'URL Apps Script `/exec`: **il modulo HTML attuale utilizza ancora temporaneamente FormSubmit/email**, per non perdere richieste senza un endpoint Google realmente attivo. Quando riceveremo l'URL, sostituiremo l'action del form e rimuoveremo i campi FormSubmit; l'invio sarà **solo verso Google Fogli**, senza email.
