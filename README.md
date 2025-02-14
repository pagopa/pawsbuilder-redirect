# Rewriter Project

Questo progetto permette di reindirizzare dinamicamente determinate URL verso nuovi endpoint, sia versionati che non versionati, utilizzando espressioni regolari. 

Il codice è scritto per essere eseguito come [CloudFront Function](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-functions.html) (AWS). 

## Teoria delle operazioni

- La URI in ingresso viene testata sulle regex elencate nell'array `regexPatterns`. 

- Al primo match, viene restituito il redirect (301) alla URL ottenuta combinando la proprietà `redirectTo` ed eventuali informazioni presenti nell'URI originale ed estratte dalla regex stessa.

- Se non è stata trovata alcuna regola, la richiesta viene restituita senza modifiche.

## Struttura del Progetto

- **`src/`**: Contiene il file `rewriter.js` con la logica di redirect.
- **`tests/`**: Contiene i test per validare il comportamento del rewriter.

## Flusso di lavoro per l’aggiunta di nuove regole

1. **Aggiornamento del Codice**

   Modifica `src/rewriter.js` per aggiungere la nuova regola di rewrite. La nuova regola va inserita all'interno dell'array `regexPatterns`. 

   > Attenzione: CloudFront Function supporta JavaScript ECMAScript 5.1!

2. **Creazione dei Test**

   Aggiungi o aggiorna i test nella cartella `tests/` per verificare la nuova regola.

3. **Esecuzione dei Test**

   Esegui:
   ```bash
   npm test
    ```

   Assicurati che tutti i test, inclusi quelli per la nuova regola, vengano superati.

   > Attenzione: L'esecuzione dei test include i check di compatibilità con Javascript ECMAScript 5.1 richiesto dalle CloudFront Function!

## Helper per la scrittura di regex
Per facilitare la scrittura delle regex di riconoscimento è disponibile l'_helper_: `simpleHelper`. 

### simpleHelper
Riconosce semplici path identificati da una stringa iniziale statica.

Il _builder_ accetta un parametro:
- _base_: stringa iniziale dell'URI

La regex crea un gruppo:

- 1: (opzionale) contiene il path

Ad esempio invocando l'helper `simpleHelper("/path_molto_esteso/sotto-path/path_finale")` otteniamo una regex che restituirà i seguenti valori:

| URI | gruppo 1 |
| --- | ------- |
| /path_molto_esteso/sotto_path/path_finale | /path_finale



## Distribuzione
Una volta verificata la nuova regola, copia il file **[src/rewriter.js](/src/rewriter.js)** aggiornato nella CloudFront Function, in modo che l’ambiente di produzione utilizzi la versione testata.
