
-----

# 🚩 Vuln Gallery CTF

 Benvenuto a **Vuln Gallery**, una CTF (Capture The Flag) di livello intermedio basata su Linux.

Questa sfida ti guiderà dall'exploit iniziale di un'applicazione web moderna fino alla privilege escalation su un sistema Linux mal configurato. La tua missione è sfruttare le vulnerabilità, muoverti lateralmente nel sistema e ottenere il controllo completo.

-----

## 🚀 Come Giocare

Questo progetto utilizza Docker e Docker Compose per una configurazione rapida e consistente. Devi solo averli installati.

1.  **Clona questo repository** (o scarica il file zip della cartella `player-deploy`).

2.  **Apri un terminale** e naviga nella directory `player-deploy`:

    ```bash
    cd player-deploy
    ```

3.  **Avvia la macchina** in background con il seguente comando:

    ```bash
    docker-compose up -d
    ```

    Docker scaricherà l'immagine della macchina e la avvierà.

-----

## 🎯 Il Tuo Bersaglio

La macchina della CTF è ora in esecuzione e raggiungibile al seguente indirizzo IP statico:

## 172.20.0.10

Inizia la tua fase di ricognizione da qui.

-----

## 🏁 Obiettivi

Il tuo scopo è trovare e leggere due flag nel sistema:

1.  **`user.txt`**: Ottieni l'accesso come utente.
2.  **`root.txt`**: Scala i tuoi privilegi fino a `root`.

-----

## 🧹 Pulizia

Quando hai finito, puoi fermare e rimuovere il container con un singolo comando dalla directory `player-deploy`:

```bash
docker-compose down
```

-----

### ⚠️ Disclaimer

Questa macchina è stata progettata per scopi educativi e di training sulla sicurezza informatica. Tutte le vulnerabilità sono intenzionali. Per favore, eseguila in un ambiente di rete isolato.

Buona caccia e divertiti a hackerare\! 🕵️‍♂️
